// service-worker.js
const cacheName = 'your-cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll([
          // '/',
          // '/index.html',
          // '/styles.css',
          // '/app.js',
          // '/data/eng-asv.json'
        ]);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
  );
});
