const CACHE_NAME = '29029-training-v2';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      // Update cache with fresh version
      const clone = response.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return response;
    }).catch(() => {
      // Offline fallback to cache
      return caches.match(e.request);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
