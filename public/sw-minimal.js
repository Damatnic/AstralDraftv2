// Minimal Service Worker for Astral Draft
const CACHE = 'astral-draft-minimal-v1';

self.addEventListener('install', e => {
  console.log('[SW] Install');
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  console.log('[SW] Activate');
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(cached => {
        const fresh = fetch(e.request).then(response => {
          if (response.ok) {
            cache.put(e.request, response.clone()).catch(() => {});
          }
          return response;
        }).catch(() => cached || new Response('Offline'));
        
        return cached || fresh;
      });
    })
  );
});

console.log('[SW] Minimal SW ready');