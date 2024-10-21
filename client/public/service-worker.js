// Check if self.__WB_MANIFEST exists, only then apply precaching
if (typeof self.__WB_MANIFEST !== 'undefined') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-core.prod.js'
  );
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-precaching.prod.js'
  );
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-routing.prod.js'
  );
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-strategies.prod.js'
  );
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-expiration.prod.js'
  );
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-cacheable-response.prod.js'
  );

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Additional runtime caching
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets-cache',
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
      ],
    })
  );
} else {
  console.log('Service worker skipping precaching in development mode');
}
