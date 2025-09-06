/**
 * Advanced Service Worker for Fantasy Football Application
 * Implements intelligent caching strategies for optimal performance
 */

const CACHE_NAME = 'fantasy-football-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1.0.0';
const API_CACHE = 'api-cache-v1.0.0';
const ASSETS_CACHE = 'assets-cache-v1.0.0';

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  // Critical app shell - Cache First
  APP_SHELL: [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/index-DXgHX-Fn.js',
    '/assets/react-vendor-MRNPEfIm.js'
  ],
  
  // Static assets - Stale While Revalidate
  STATIC_ASSETS: /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$/,
  
  // API calls - Network First with fallback
  API_ROUTES: /^\/api\//,
  
  // Lazy-loaded components - Cache First with background sync
  COMPONENTS: /assets\/(.*)-chunk-(.*).js$/
};

// Cache configuration
const CACHE_CONFIG = {
  maxAge: {
    api: 1000 * 60 * 5,        // API: 5 minutes
    assets: 1000 * 60 * 60 * 24 * 7,  // Assets: 1 week
    components: 1000 * 60 * 60 * 24 * 30  // Components: 30 days
  },
  maxEntries: {
    api: 50,
    runtime: 100,
    assets: 200
  }
};

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Caching app shell...');
        return cache.addAll(CACHE_STRATEGIES.APP_SHELL);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== RUNTIME_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== ASSETS_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

/**
 * Fetch Event Handler - Intelligent Routing
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Route to appropriate caching strategy
  if (isAppShellRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
  } else if (isStaticAssetRequest(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request, ASSETS_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
  } else if (isComponentRequest(request)) {
    event.respondWith(cacheFirstWithBackgroundSync(request, RUNTIME_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationFallback(request));
  }
});

/**
 * Cache First Strategy - For app shell and critical resources
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📋 Cache hit:', request.url);
      return cachedResponse;
    }
    
    console.log('🌐 Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Cache first strategy failed:', error);
    return new Response('Offline - Resource unavailable', { status: 503 });
  }
}

/**
 * Network First Strategy - For API calls and dynamic content
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log('🌐 Network first:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      
      // Add cache headers
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cache-timestamp', Date.now().toString());
      
      // Expire old entries
      await expireCache(cache, CACHE_CONFIG.maxEntries.api);
      
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📋 Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cached response is stale
      const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
      const isStale = cacheTimestamp && 
        (Date.now() - parseInt(cacheTimestamp)) > CACHE_CONFIG.maxAge.api;
      
      if (isStale) {
        console.log('⚠️ Serving stale cache:', request.url);
      }
      
      return cachedResponse;
    }
    
    return new Response('Offline - API unavailable', { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Stale While Revalidate Strategy - For static assets
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch in background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors for this strategy
  });
  
  if (cachedResponse) {
    console.log('📋 Serving from cache (revalidating):', request.url);
    return cachedResponse;
  }
  
  console.log('🌐 No cache, waiting for network:', request.url);
  return fetchPromise || new Response('Offline', { status: 503 });
}

/**
 * Cache First with Background Sync - For component chunks
 */
async function cacheFirstWithBackgroundSync(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📋 Component cache hit:', request.url);
      
      // Background sync for critical components
      if (isCriticalComponent(request)) {
        fetch(request).then(networkResponse => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
        }).catch(() => {
          // Ignore background sync errors
        });
      }
      
      return cachedResponse;
    }
    
    console.log('🌐 Component cache miss:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.log('💾 Cached component:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Component caching failed:', error);
    return new Response('Component unavailable offline', { status: 503 });
  }
}

/**
 * Navigation Fallback - For SPA routing
 */
async function navigationFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('📋 Navigation fallback to index.html');
    const cache = await caches.open(CACHE_NAME);
    const fallbackResponse = await cache.match('/index.html');
    
    return fallbackResponse || new Response('App unavailable offline', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

/**
 * Request Type Checkers
 */
function isAppShellRequest(request) {
  return CACHE_STRATEGIES.APP_SHELL.some(url => request.url.endsWith(url));
}

function isStaticAssetRequest(request) {
  return CACHE_STRATEGIES.STATIC_ASSETS.test(request.url);
}

function isAPIRequest(request) {
  return CACHE_STRATEGIES.API_ROUTES.test(request.url);
}

function isComponentRequest(request) {
  return CACHE_STRATEGIES.COMPONENTS.test(request.url);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' && request.destination === 'document';
}

function isCriticalComponent(request) {
  const criticalComponents = [
    'team-hub-chunk',
    'player-components-chunk',
    'ui-components-chunk'
  ];
  return criticalComponents.some(component => request.url.includes(component));
}

/**
 * Cache Management Utilities
 */
async function expireCache(cache, maxEntries) {
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const entriesToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(
      entriesToDelete.map(key => cache.delete(key))
    );
    console.log(`🗑️ Expired ${entriesToDelete.length} cache entries`);
  }
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending offline actions
    console.log('🔄 Performing background sync...');
    
    // This would typically sync offline user actions
    // For now, just preload critical components
    const criticalUrls = [
      '/assets/team-hub-chunk.js',
      '/assets/player-components-chunk.js'
    ];
    
    const cache = await caches.open(RUNTIME_CACHE);
    await Promise.all(
      criticalUrls.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            cache.put(url, response.clone());
          }
        }).catch(() => {
          // Ignore sync errors
        })
      )
    );
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

/**
 * Push Notification Handler
 */
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icon-192.png',
    badge: '/assets/badge-72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.priority === 'high'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const data = event.notification.data;
  const action = event.action;
  
  if (action === 'open' || !action) {
    event.waitUntil(
      clients.openWindow(data.url || '/')
    );
  }
});

/**
 * Message Handler for cache invalidation
 */
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(data.cacheName));
      break;
      
    case 'PRELOAD_ROUTES':
      event.waitUntil(preloadRoutes(data.routes));
      break;
      
    case 'GET_CACHE_SIZE':
      event.waitUntil(getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      }));
      break;
  }
});

async function clearCache(cacheName) {
  if (cacheName) {
    await caches.delete(cacheName);
    console.log(`🗑️ Cleared cache: ${cacheName}`);
  } else {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ Cleared all caches');
  }
}

async function preloadRoutes(routes) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  await Promise.all(
    routes.map(route => 
      fetch(route).then(response => {
        if (response.ok) {
          cache.put(route, response.clone());
          console.log('📦 Preloaded:', route);
        }
      }).catch(error => {
        console.error('❌ Preload failed for:', route, error);
      })
    )
  );
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

console.log('🚀 Advanced Service Worker initialized');