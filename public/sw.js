/* global clients */
// Service Worker — enables offline caching, PWA install, and push notifications
const CACHE_NAME = 'aworthy-lms-v16';
const ASSETS_CACHE = 'aworthy-assets-v16'; // immutable hashed bundles
const RESOURCES_CACHE = 'aworthy-resources-v1'; // explicitly saved Firebase Storage documents
const FETCH_TIMEOUT_MS = 5000;
const APP_SHELL = [
  '/',
  '/index.html',
  '/logo-aworthy.jpeg',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== ASSETS_CACHE && k !== RESOURCES_CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Handle explicit "save for offline" requests from the app
self.addEventListener('message', e => {
  if (e.data?.type === 'CACHE_RESOURCE') {
    const { url } = e.data;
    if (!url) return;
    e.waitUntil(
      caches.open(RESOURCES_CACHE).then(cache =>
        fetch(url, { mode: 'cors' })
          .then(res => { if (res.ok) cache.put(url, res); })
          .catch(() => { /* network unavailable — silently ignore */ })
      )
    );
  }
  if (e.data?.type === 'UNCACHE_RESOURCE') {
    const { url } = e.data;
    if (!url) return;
    e.waitUntil(caches.open(RESOURCES_CACHE).then(cache => cache.delete(url)));
  }
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Firebase Storage documents — resource-cache-first, then network
  if (url.hostname.includes('firebasestorage.googleapis.com')) {
    e.respondWith(
      caches.open(RESOURCES_CACHE).then(cache =>
        cache.match(e.request.url).then(cached => cached || fetch(e.request))
      )
    );
    return;
  }

  // Hashed JS/CSS bundles — cache-first, immutable (content hash guarantees freshness)
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.open(ASSETS_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res && res.status === 200) cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Navigation — network-first with 4s timeout, fall back to cached index.html for SPA routing
  if (e.request.mode === 'navigate') {
    e.respondWith(
      Promise.race([
        fetch(e.request),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000)),
      ]).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Everything else — network-first with timeout, then cache
  const fetchWithTimeout = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT_MS);
    fetch(e.request).then(res => { clearTimeout(timer); resolve(res); }).catch(err => { clearTimeout(timer); reject(err); });
  });

  e.respondWith(
    fetchWithTimeout
      .then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

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
