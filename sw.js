// JARVIS Service Worker — Auto-updating
const CACHE_VERSION = 'jarvis-' + Date.now();
const CACHE_NAME = CACHE_VERSION;

// Install — skip waiting to activate immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('SW: New version installing...');
});

// Activate — delete ALL old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          console.log('SW: Deleting old cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      console.log('SW: All old caches cleared!');
      return self.clients.claim();
    })
  );
});

// Fetch — ALWAYS get fresh from network, never from cache
self.addEventListener('fetch', event => {
  // Only handle same-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, try cache as fallback
        return caches.match(event.request);
      })
    );
  }
});
