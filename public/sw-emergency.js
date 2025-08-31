// Emergency minimal service worker - zero complexity
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
console.log('Emergency SW loaded');