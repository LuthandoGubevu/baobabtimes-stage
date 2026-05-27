// Firebase Messaging (background push notifications)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBeRI9eBxt1k_E3TnvYbkWVwtde6btdOec",
  authDomain: "baobabtimes-8e889.firebaseapp.com",
  projectId: "baobabtimes-8e889",
  storageBucket: "baobabtimes-8e889.firebasestorage.app",
  messagingSenderId: "925667554087",
  appId: "1:925667554087:web:f2ee8070d99fed93966f02"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'The Baobab Times';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    data: payload.data || {},
    tag: 'baobab-notification'
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) client.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});

// ---- Cache management ----
const CACHE_NAME = 'baobab-times-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
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
