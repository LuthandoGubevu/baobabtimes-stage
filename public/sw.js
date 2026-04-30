const CACHE_NAME = 'baobab-times-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/HarveyValues.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests, like Firestore
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests or video files
  if (event.request.url.includes('/api/') || event.request.url.endsWith('.mp4')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
