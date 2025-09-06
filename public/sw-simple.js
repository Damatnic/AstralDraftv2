/**
 * Simple Service Worker for Astral Draft
 * Lightweight version to avoid script evaluation errors
 */

const CACHE_NAME = 'astral-draft-v1.0.1';

// Basic files to cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/favicon.svg'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        // Use addAll with error handling
        return cache.addAll(STATIC_FILES).catch((error) => {
          console.warn('[SW] Failed to cache some files:', error);
          // Don't fail installation
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
        // Still skip waiting to activate
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('astral-draft-')) {
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

// Fetch event - simple cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and non-http requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Cache successful responses
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone).catch(() => {
                // Silently ignore cache errors
              });
            });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/') || new Response('Offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
        throw new Error('Network error');
      })
  );
});

console.log('[SW] Simple Service Worker loaded');