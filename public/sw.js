/**
 * Astral Draft Service Worker
 * Provides offline functionality, caching, and push notifications
 */

const CACHE_NAME = 'astral-draft-v1.0.1';
const STATIC_CACHE_NAME = 'astral-draft-static-v1.0.1';
const DYNAMIC_CACHE_NAME = 'astral-draft-dynamic-v1.0.1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  // Core CSS and JS files will be added by Vite build
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/players/,
  /\/api\/teams/,
  /\/api\/leagues/,
  /\/api\/scores/
];

// Files that should always be fetched from network
const NETWORK_FIRST_PATTERNS = [
  /\/api\/live-scores/,
  /\/api\/notifications/,
  /\/api\/messages/,
  /\/api\/trades/
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_API_CACHE_SIZE = 100;

/**
 * Install Event - Cache static files
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static files');
        // Only cache existing files, don't fail if some are missing
        return Promise.allSettled(
          STATIC_FILES.map(url => 
            cache.add(url).catch(err => {
              console.warn(`[SW] Failed to cache ${url}:`, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
        // Don't fail installation even if caching fails
        return self.skipWaiting();
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
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
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event - Handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy for real-time data
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Cache-first strategy for API data
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Stale-while-revalidate for static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$/)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }

  // Default: Cache-first for HTML pages
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Network-first strategy: Try network, fallback to cache
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      // Check for partial responses which cannot be cached
      if (networkResponse.status !== 206) {
        try {
          await cache.put(request, networkResponse.clone());
        } catch (cacheError) {
          console.warn('[SW] Failed to cache response:', cacheError);
        }
      }
      await limitCacheSize(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_SIZE);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

/**
 * Cache-first strategy: Try cache, fallback to network
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      // Check for partial responses which cannot be cached
      if (networkResponse.status !== 206) {
        try {
          await cache.put(request, networkResponse.clone());
        } catch (cacheError) {
          console.warn('[SW] Failed to cache response:', cacheError);
        }
      }
      await limitCacheSize(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_SIZE);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache and network failed:', error);
    
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

/**
 * Stale-while-revalidate strategy: Return cache immediately, update in background
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const networkResponsePromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        // Check for partial responses which cannot be cached
        if (networkResponse.status !== 206) {
          try {
            await cache.put(request, networkResponse.clone());
          } catch (cacheError) {
            console.warn('[SW] Failed to cache response:', cacheError);
          }
        }
      }
      return networkResponse;
    })
    .catch(() => null);
  
  return cachedResponse || networkResponsePromise;
}

/**
 * Limit cache size to prevent storage bloat
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`[SW] Cleaned ${keysToDelete.length} items from ${cacheName}`);
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
    icon: '/icon-192.png',
    badge: '/badge-72.png',
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

  // Customize notification based on type
  if (notificationData.type) {
    switch (notificationData.type) {
      case 'trade_proposal':
        notificationData.icon = '/icon-trade.png';
        notificationData.actions = [
          { action: 'view_trade', title: 'View Trade' },
          { action: 'dismiss', title: 'Dismiss' }
        ];
        break;
      
      case 'waiver_result':
        notificationData.icon = '/icon-waiver.png';
        notificationData.actions = [
          { action: 'view_team', title: 'View Team' },
          { action: 'dismiss', title: 'Dismiss' }
        ];
        break;
      
      case 'score_update':
        notificationData.icon = '/icon-score.png';
        notificationData.actions = [
          { action: 'view_scores', title: 'View Scores' },
          { action: 'dismiss', title: 'Dismiss' }
        ];
        break;
      
      case 'message':
        notificationData.icon = '/icon-message.png';
        notificationData.actions = [
          { action: 'view_message', title: 'Reply' },
          { action: 'dismiss', title: 'Dismiss' }
        ];
        break;
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

  let url = '/';
  
  // Handle different notification actions
  switch (event.action) {
    case 'view_trade':
      url = '/?view=trades';
      break;
    case 'view_team':
      url = '/?view=team';
      break;
    case 'view_scores':
      url = '/?view=scoring';
      break;
    case 'view_message':
      url = '/?view=messages';
      break;
    case 'dismiss':
      return; // Just close the notification
    default:
      // Default click action based on notification type
      if (event.notification.data?.type) {
        switch (event.notification.data.type) {
          case 'trade_proposal':
            url = '/?view=trades';
            break;
          case 'waiver_result':
            url = '/?view=team';
            break;
          case 'score_update':
            url = '/?view=scoring';
            break;
          case 'message':
            url = '/?view=messages';
            break;
        }
      }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              action: event.action,
              url: url
            });
            return;
          }
        }
        
        // Open new window if app is not open
        return clients.openWindow(url);
      })
  );
});

/**
 * Background Sync Event - Handle offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'sync-trades':
      event.waitUntil(syncTrades());
      break;
    case 'sync-waivers':
      event.waitUntil(syncWaivers());
      break;
    case 'sync-messages':
      event.waitUntil(syncMessages());
      break;
    default:
      console.log('[SW] Unknown sync tag:', event.tag);
  }
});

/**
 * Sync offline trades when connection is restored
 */
async function syncTrades() {
  try {
    // Get pending trades from IndexedDB
    const pendingTrades = await getFromIndexedDB('pending_trades');
    
    for (const trade of pendingTrades) {
      try {
        const response = await fetch('/api/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trade)
        });
        
        if (response.ok) {
          await removeFromIndexedDB('pending_trades', trade.id);
          console.log('[SW] Synced trade:', trade.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync trade:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Trade sync failed:', error);
  }
}

/**
 * Sync offline waiver claims when connection is restored
 */
async function syncWaivers() {
  try {
    const pendingWaivers = await getFromIndexedDB('pending_waivers');
    
    for (const waiver of pendingWaivers) {
      try {
        const response = await fetch('/api/waivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(waiver)
        });
        
        if (response.ok) {
          await removeFromIndexedDB('pending_waivers', waiver.id);
          console.log('[SW] Synced waiver:', waiver.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync waiver:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Waiver sync failed:', error);
  }
}

/**
 * Sync offline messages when connection is restored
 */
async function syncMessages() {
  try {
    const pendingMessages = await getFromIndexedDB('pending_messages');
    
    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
        
        if (response.ok) {
          await removeFromIndexedDB('pending_messages', message.id);
          console.log('[SW] Synced message:', message.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync message:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Message sync failed:', error);
  }
}

/**
 * IndexedDB helper functions
 */
function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AstralDraftDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AstralDraftDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

/**
 * Message Event - Handle messages from main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
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

console.log('[SW] Service Worker loaded successfully');