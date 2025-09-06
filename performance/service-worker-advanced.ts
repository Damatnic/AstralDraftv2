/**
 * Advanced Service Worker
 * Intelligent caching and performance optimization
 */

/// <reference lib="webworker" />

const CACHE_NAME = 'astral-draft-v2.0.0';
const PRECACHE_NAME = 'astral-draft-precache-v2.0.0';
const RUNTIME_CACHE = 'astral-draft-runtime-v2.0.0';

// Critical resources to precache
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Core app shell files will be added by build process
];

// Caching strategies configuration
const CACHE_STRATEGIES = {
  // Static assets - Cache First
  static: {
    pattern: /\.(js|css|woff2|woff|ttf|ico|png|jpg|jpeg|gif|svg|webp)$/,
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // API responses - Network First with fallback
  api: {
    pattern: /^https:\/\/.*\/api\//,
    strategy: 'NetworkFirst',
    maxAge: 5 * 60, // 5 minutes
    networkTimeout: 3000, // 3 seconds
  },
  
  // HTML pages - Stale While Revalidate
  pages: {
    pattern: /\.html$|\/$/,
    strategy: 'StaleWhileRevalidate',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  // Images - Cache First with fallback
  images: {
    pattern: /\.(png|jpg|jpeg|gif|webp|svg)$/,
    strategy: 'CacheFirst',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  // Fonts - Cache First (long term)
  fonts: {
    pattern: /\.(woff2|woff|ttf|otf)$/,
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
};

// Install event - precache critical resources
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const precacheCache = await caches.open(PRECACHE_NAME);
      
      // Precache critical resources
      await precacheCache.addAll(PRECACHE_URLS);
      
      // Force activation of new service worker
      await self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // Take control of all clients
      await self.clients.claim();
      
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
//         cacheNames
          .filter(name => 
            name !== CACHE_NAME && 
            name !== PRECACHE_NAME && 
            name !== RUNTIME_CACHE
          )
          .map(name => caches.delete(name))
      );
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(handleFetchRequest(event.request));
});

/**
 * Main fetch request handler with intelligent caching
 */
async function handleFetchRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // Find matching caching strategy
  const strategy = findMatchingStrategy(request);
  if (!strategy) {
    return fetch(request);
  }
  
  switch (strategy.strategy) {
    case 'CacheFirst':
      return cacheFirstStrategy(request, strategy);
    case 'NetworkFirst':
      return networkFirstStrategy(request, strategy);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidateStrategy(request, strategy);
    default:
      return fetch(request);
  }

/**
 * Find matching caching strategy for request
 */
function findMatchingStrategy(request: Request): any {
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(request.url)) {
      return { name, ...config };
    }
  }
  return null;

/**
 * Cache First Strategy - serve from cache, fallback to network
 */
async function cacheFirstStrategy(request: Request, strategy: any): Promise<Response> {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  if (cached && !isExpired(cached, strategy.maxAge)) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Clone before caching
      const responseClone = response.clone();
      
      // Add timestamp for expiration checking
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers,
      });
      
      cache.put(request, cachedResponse);
    }
    
    return response;
  } catch (error) {
    // Return cached version even if expired
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }

/**
 * Network First Strategy - try network, fallback to cache
 */
async function networkFirstStrategy(request: Request, strategy: any): Promise<Response> {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    // Try network with timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), strategy.networkTimeout)
    );
    
    const response = await Promise.race([networkPromise, timeoutPromise]);
    
    if (response.ok) {
      // Cache successful response
      const responseClone = response.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers,
      });
      
      cache.put(request, cachedResponse);
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    throw error;
  }

/**
 * Stale While Revalidate Strategy - serve cached, update in background
 */
async function staleWhileRevalidateStrategy(request: Request, strategy: any): Promise<Response> {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  // Start network request (don't wait for it)
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const responseClone = response.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers,
      });
      
      cache.put(request, cachedResponse);
    }
    return response;
  }).catch(() => {
    // Network failed, no update to cache
  });
  
  // Return cached version immediately if available
  if (cached && !isExpired(cached, strategy.maxAge)) {
    return cached;
  }
  
  // No valid cache, wait for network
  try {
    return await networkPromise;
  } catch (error) {
    // Return stale cache as last resort
    if (cached) {
      return cached;
    }
    throw error;
  }

/**
 * Check if cached response is expired
 */
function isExpired(response: Response, maxAge: number): boolean {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return true;
  
  const cacheTime = parseInt(cachedAt);
  const currentTime = Date.now();
  
  return (currentTime - cacheTime) > (maxAge * 1000);

/**
 * Handle background sync for failed requests
 */
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'retry-failed-requests') {
    event.waitUntil(retryFailedRequests());
  }
});

/**
 * Retry failed requests when online
 */
async function retryFailedRequests() {
  // Implementation for retrying failed API calls
  // This would integrate with your offline queue system

/**
 * Handle push notifications
 */
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options: NotificationOptions = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data,
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

/**
 * Message handler for cache management
 */
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
  
  if (event.data && event.data.type === 'PRELOAD_RESOURCES') {
    event.waitUntil(preloadResources(event.data.urls));
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));

/**
 * Preload specific resources
 */
async function preloadResources(urls: string[]): Promise<void> {
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.addAll(urls);

// Export type definitions for TypeScript
export type CacheStrategy = 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate';

export interface StrategyConfig {
  pattern: RegExp;
  strategy: CacheStrategy;
  maxAge: number;
  networkTimeout?: number;
