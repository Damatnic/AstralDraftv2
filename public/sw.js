/**
 * Astral Draft Service Worker - PWA Features Only
 * Provides offline functionality and PWA features without CSS interception
 */

const CACHE_NAME = 'astral-draft-v2.0.0';
const STATIC_CACHE_NAME = 'astral-draft-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'astral-draft-dynamic-v2.0.0';

// Only cache essential files for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// API endpoints that are safe to cache
const CACHEABLE_API_PATTERNS = [
  /\/api\/players\/static/,
  /\/api\/teams\/basic/,
  /\/api\/leagues\/info/
];

// Never cache these patterns to avoid CSS/JS interception issues
const NEVER_CACHE_PATTERNS = [
  /\.css$/,
  /\.js$/,
  /\.mjs$/,
  /assets\//,
  /\/@/,
  /\/node_modules/,
  /vite/,
  /hot/
];

/**
 * Install Event - Cache only essential files
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.0.0');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential files only');
        // Only cache files that definitely exist
        return Promise.allSettled([
          cache.add('/').catch(e => console.warn('[SW] Could not cache /', e)),
          cache.add('/index.html').catch(e => console.warn('[SW] Could not cache /index.html', e)),
          cache.add('/manifest.json').catch(e => console.warn('[SW] Could not cache /manifest.json', e))
        ]);
      })
      .then(() => {
        console.log('[SW] Essential files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache essential files:', error);
        return self.skipWaiting();
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2.0.0');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('astral-draft-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event - Minimal caching to avoid CSS/JS interception
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // NEVER intercept CSS, JS, or asset files to prevent loading issues
  if (NEVER_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    console.log('[SW] Skipping cache for asset:', url.pathname);
    return;
  }

  // Only handle specific safe requests
  if (url.pathname === '/' || 
      url.pathname === '/index.html' || 
      url.pathname === '/manifest.json' ||
      CACHEABLE_API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    
    event.respondWith(handleSafeRequest(request));
  }
});

/**
 * Handle only safe requests that won't interfere with app loading
 */
async function handleSafeRequest(request) {
  try {
    // Always try network first for main app files
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && networkResponse.status < 400) {
      // Only cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      try {
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn('[SW] Failed to cache response:', cacheError);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    // Only return cached version for specific files
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return minimal offline page for navigation requests only
    if (request.mode === 'navigate') {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Astral Draft - Offline</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white; }
              .offline-message { max-width: 400px; margin: 0 auto; }
              .retry-btn { background: #4ecdc4; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="offline-message">
              <h1>You're Offline</h1>
              <p>Astral Draft needs an internet connection to work properly.</p>
              <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
            </div>
          </body>
        </html>
      `, { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

/**
 * Push Event - Handle push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'Astral Draft',
    body: 'You have a new notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'default',
    requireInteraction: false,
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

/**
 * Notification Click Event - Handle notification interactions
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        return clients.openWindow(url);
      })
  );
});

/**
 * Message Event - Handle messages from main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data?.type);
  
  switch (event.data?.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: CACHE_NAME });
      break;
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0]?.postMessage({ success: true });
      });
      break;
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}

console.log('[SW] Service Worker v2.0.0 loaded - PWA features only, no CSS/JS interception');