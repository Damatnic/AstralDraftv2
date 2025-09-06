/**
 * Advanced Service Worker for Performance Optimization
 * Implements intelligent caching, resource optimization, and offline functionality
 */

const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE = `astral-draft-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `astral-draft-dynamic-${CACHE_VERSION}`;
const IMAGES_CACHE = `astral-draft-images-${CACHE_VERSION}`;
const API_CACHE = `astral-draft-api-${CACHE_VERSION}`;

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Resource patterns and their caching strategies
const RESOURCE_PATTERNS = [
  // Static assets - Cache First (long-term caching)
  {
    pattern: /\.(js|css|woff2?|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60, // 1 year
    maxEntries: 100
  },
  
  // Images - Cache First with intelligent optimization
  {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: IMAGES_CACHE,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    maxEntries: 200
  },
  
  // API endpoints - Stale While Revalidate
  {
    pattern: /\/api\//,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: API_CACHE,
    maxAge: 5 * 60, // 5 minutes
    maxEntries: 100
  },
  
  // HTML pages - Network First
  {
    pattern: /\.html$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60, // 1 day
    maxEntries: 50
  }
];

// Critical resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Core JS and CSS will be auto-detected from build
];

// Performance optimization features
const PERFORMANCE_FEATURES = {
  ENABLE_COMPRESSION: true,
  ENABLE_IMAGE_OPTIMIZATION: true,
  ENABLE_REQUEST_DEDUPLICATION: true,
  ENABLE_BACKGROUND_SYNC: true,
  ENABLE_PUSH_NOTIFICATIONS: true
};

// Request deduplication map
const pendingRequests = new Map();

// Background sync queue
const backgroundSyncQueue = [];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing Performance Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Precache critical resources
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_RESOURCES);
      }),
      
      // Initialize performance monitoring
      initializePerformanceMonitoring(),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating Performance Service Worker v' + CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      
      // Claim all clients
      self.clients.claim(),
      
      // Initialize background sync
      initializeBackgroundSync()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return;
  }
  
  event.respondWith(handleFetchRequest(event.request));
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-retry') {
    event.waitUntil(processBackgroundSyncQueue());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (PERFORMANCE_FEATURES.ENABLE_PUSH_NOTIFICATIONS) {
    event.waitUntil(handlePushNotification(event));
  }
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  // Find matching resource pattern
  const resourcePattern = RESOURCE_PATTERNS.find(pattern => 
    pattern.pattern.test(url.pathname)
  );
  
  if (!resourcePattern) {
    // Default to network first for unknown resources
    return networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Apply appropriate caching strategy
  switch (resourcePattern.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, resourcePattern.cache, resourcePattern.maxAge);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, resourcePattern.cache, resourcePattern.maxAge);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, resourcePattern.cache, resourcePattern.maxAge);
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
      
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request, resourcePattern.cache);
      
    default:
      return networkFirst(request, resourcePattern.cache);
  }
}

async function cacheFirst(request, cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      // Return cached response
      recordPerformanceMetric('cache-hit', request.url);
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetchWithOptimization(request);
    
    // Cache the response
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      recordPerformanceMetric('cache-miss', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.warn('Cache First strategy failed:', error);
    return handleOfflineResponse(request);
  }
}

async function networkFirst(request, cacheName, maxAge) {
  try {
    // Try network first
    const networkResponse = await fetchWithOptimization(request);
    
    if (networkResponse.ok) {
      // Cache the fresh response
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      recordPerformanceMetric('network-success', request.url);
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      recordPerformanceMetric('network-fallback', request.url);
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch fresh data in background
  const networkPromise = fetchWithOptimization(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached response immediately if available
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    recordPerformanceMetric('stale-while-revalidate-cached', request.url);
    
    // Update in background
    networkPromise.then((networkResponse) => {
      if (networkResponse) {
        recordPerformanceMetric('stale-while-revalidate-updated', request.url);
      }
    });
    
    return cachedResponse;
  }
  
  // Wait for network if no cache or expired
  try {
    const networkResponse = await networkPromise;
    if (networkResponse) {
      recordPerformanceMetric('stale-while-revalidate-network', request.url);
      return networkResponse;
    }
  } catch (error) {
    // Network failed, return stale cache if available
    if (cachedResponse) {
      recordPerformanceMetric('stale-while-revalidate-stale', request.url);
      return cachedResponse;
    }
  }
  
  return handleOfflineResponse(request);
}

async function networkOnly(request) {
  return fetchWithOptimization(request);
}

async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  return cache.match(request);
}

async function fetchWithOptimization(request) {
  // Request deduplication
  if (PERFORMANCE_FEATURES.ENABLE_REQUEST_DEDUPLICATION) {
    const requestKey = request.url + request.method;
    
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }
    
    const fetchPromise = fetch(request).finally(() => {
      pendingRequests.delete(requestKey);
    });
    
    pendingRequests.set(requestKey, fetchPromise);
    return fetchPromise;
  }
  
  // Enhanced fetch with timeout and retry logic
  return fetchWithRetry(request);
}

async function fetchWithRetry(request, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(request, {
        signal: controller.signal,
        ...getOptimizedRequestHeaders(request)
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      throw new Error(`HTTP ${response.status}`);
      
    } catch (error) {
      if (i === retries - 1) {
        // Add to background sync queue on final failure
        if (PERFORMANCE_FEATURES.ENABLE_BACKGROUND_SYNC) {
          addToBackgroundSyncQueue(request);
        }
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}

function getOptimizedRequestHeaders(request) {
  const headers = new Headers(request.headers);
  
  // Add compression headers
  if (PERFORMANCE_FEATURES.ENABLE_COMPRESSION) {
    headers.set('Accept-Encoding', 'gzip, deflate, br');
  }
  
  // Add caching headers for static resources
  const url = new URL(request.url);
  if (url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/)) {
    headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  }
  
  return { headers };
}

function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  const ageInSeconds = (now.getTime() - responseDate.getTime()) / 1000;
  
  return ageInSeconds > maxAge;
}

async function handleOfflineResponse(request) {
  // Return offline page for document requests
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }
  
  // Return placeholder image for image requests
  if (request.destination === 'image') {
    return new Response(
      createPlaceholderImageSVG(),
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
  
  // Return minimal JSON for API requests
  if (request.url.includes('/api/')) {
    return new Response(
      JSON.stringify({ 
        offline: true, 
        message: 'This feature is unavailable offline' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  throw new Error('Offline and no cached response available');
}

function createPlaceholderImageSVG(width = 300, height = 200) {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="14" 
            text-anchor="middle" dy="0.3em" fill="#6b7280">
        Image unavailable offline
      </text>
    </svg>
  `;
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('astral-draft-') && !name.includes(CACHE_VERSION)
  );
  
  return Promise.all(
    oldCaches.map(cacheName => {
      console.log('Service Worker: Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
}

async function initializePerformanceMonitoring() {
  // Set up performance monitoring
  if ('BroadcastChannel' in self) {
    const channel = new BroadcastChannel('sw-performance');
    
    // Listen for performance metrics from main thread
    channel.addEventListener('message', (event) => {
      if (event.data.type === 'performance-metric') {
        recordPerformanceMetric(event.data.name, event.data.value, event.data.url);
      }
    });
  }
}

function recordPerformanceMetric(name, value, url = '') {
  // Store metrics for later analysis
  const metric = {
    name,
    value,
    url,
    timestamp: Date.now()
  };
  
  // Send to analytics if available
  if ('BroadcastChannel' in self) {
    const channel = new BroadcastChannel('sw-performance');
    channel.postMessage({
      type: 'sw-metric',
      metric
    });
  }
  
  console.log(`SW Performance: ${name} - ${value} (${url})`);
}

async function initializeBackgroundSync() {
  if (!('sync' in self.registration)) {
    console.log('Background Sync not supported');
    return;
  }
  
  console.log('Background Sync initialized');
}

function addToBackgroundSyncQueue(request) {
  backgroundSyncQueue.push({
    url: request.url,
    method: request.method,
    headers: [...request.headers.entries()],
    body: request.body,
    timestamp: Date.now()
  });
  
  // Request background sync
  self.registration.sync.register('background-sync-retry');
}

async function processBackgroundSyncQueue() {
  const retryQueue = [...backgroundSyncQueue];
  backgroundSyncQueue.length = 0; // Clear queue
  
  for (const requestData of retryQueue) {
    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers: new Headers(requestData.headers),
        body: requestData.body
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      console.log('Background sync success:', requestData.url);
      
    } catch (error) {
      console.warn('Background sync failed:', requestData.url, error);
      
      // Re-queue if not too old (24 hours)
      const age = Date.now() - requestData.timestamp;
      if (age < 24 * 60 * 60 * 1000) {
        backgroundSyncQueue.push(requestData);
      }
    }
  }
  
  // Request another sync if items remain
  if (backgroundSyncQueue.length > 0) {
    self.registration.sync.register('background-sync-retry');
  }
}

async function handlePushNotification(event) {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    ...data.options
  };
  
  return self.registration.showNotification(
    data.title || 'Astral Draft',
    options
  );
}

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Handle notification action
  if (event.action) {
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

function handleNotificationAction(action, data) {
  switch (action) {
    case 'view':
      return clients.openWindow(data.url || '/');
    case 'dismiss':
      return Promise.resolve();
    default:
      return clients.openWindow('/');
  }
}

console.log('Performance Service Worker loaded successfully v' + CACHE_VERSION);