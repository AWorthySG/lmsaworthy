// Service Worker — enables offline caching, PWA install, and push notifications
const CACHE_NAME = 'aworthy-lms-v4';
const APP_SHELL = ['/', '/index.html', '/logo-aworthy.jpeg', '/manifest.json'];

self.addEventListener('install', e => {
  // Pre-cache app shell for offline support
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete all old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Network-first strategy with offline fallback
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Don't cache JS/CSS asset bundles — they have content hashes in filenames
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // For navigation requests, serve index.html (SPA)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'A Worthy', body: 'You have a new notification' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo-aworthy.jpeg',
      badge: '/logo-aworthy.jpeg',
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
