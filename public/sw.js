// Service Worker — enables offline caching, PWA install, and push notifications
const CACHE_NAME = 'aworthy-lms-v6';
const MAX_CACHE_ITEMS = 100;
const FETCH_TIMEOUT_MS = 8000;
const APP_SHELL = [
  '/',
  '/index.html',
  '/logo-aworthy.jpeg',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

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
  // Never cache API calls — let them hit Cloud Functions directly
  if (url.pathname.startsWith('/api/')) return;
  // Don't cache JS/CSS asset bundles — they have content hashes in filenames
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // For navigation requests, serve index.html (SPA)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  const fetchWithTimeout = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT_MS);
    fetch(e.request).then(res => { clearTimeout(timer); resolve(res); }).catch(err => { clearTimeout(timer); reject(err); });
  });
  e.respondWith(
    fetchWithTimeout
      .then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, clone);
            cache.keys().then(keys => {
              if (keys.length > MAX_CACHE_ITEMS) {
                keys.slice(0, keys.length - MAX_CACHE_ITEMS).forEach(k => cache.delete(k));
              }
            });
          });
        }
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
