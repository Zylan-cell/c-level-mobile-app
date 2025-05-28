// Service Worker for C-Level Mobile App
const CACHE_NAME = 'c-level-mobile-app-v1';

// Base path for GitHub Pages
const BASE_PATH = '/c-level-mobile-app';

// Assets to cache
const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/dashboard`,
  `${BASE_PATH}/tasks`,
  `${BASE_PATH}/briefs`,
  `${BASE_PATH}/c-level`,
  `${BASE_PATH}/profile`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-192x192.svg`,
  `${BASE_PATH}/icons/icon-512x512.svg`,
  `${BASE_PATH}/icons/maskable-icon-192x192.svg`,
  `${BASE_PATH}/icons/maskable-icon-512x512.svg`,
  `${BASE_PATH}/screenshots/dashboard.png`
];

// Installation and caching of assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
  );
});

// Intercept fetch requests and respond from cache if possible
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests (HTML pages), use a network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request) || caches.match('/');
        })
    );
    return;
  }

  // For other requests, use a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses or non-GET requests
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();

            // Cache the new resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // For image requests, return a fallback if available
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon-192x192.svg');
            }
            
            // Return whatever we have in cache or nothing
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});

// Clean up old caches when a new service worker is activated
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Immediately claim clients so the page doesn't need to be refreshed
  event.waitUntil(self.clients.claim());
});
