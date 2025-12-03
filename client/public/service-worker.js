/* eslint-disable no-undef */
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

  // API Response Caching - Cache GET requests to API endpoints
  workbox.routing.registerRoute(
    ({ url, request }) =>
      request.method === 'GET' &&
      (url.pathname.startsWith('/api/workouts') ||
        url.pathname.startsWith('/api/exercises') ||
        url.pathname.startsWith('/api/weight') ||
        url.pathname.startsWith('/api/bodyfat') ||
        url.pathname.startsWith('/api/health')),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // Cache API responses for 1 day
        }),
      ],
    })
  );
} else {
  console.log('Service worker skipping precaching in development mode');
}

// Background Sync for offline mutations
const QUEUE_NAME = 'fitlog-offline-queue';

// Listen for sync events
self.addEventListener('sync', (event) => {
  if (event.tag === QUEUE_NAME) {
    event.waitUntil(syncOfflineQueue());
  }
});

// Function to sync offline queue
async function syncOfflineQueue() {
  try {
    // Open IndexedDB to get queued requests
    const db = await openIndexedDB();
    const requests = await getAllQueuedRequests(db);

    if (requests.length === 0) {
      console.log('No queued requests to sync');
      return;
    }

    console.log(`Syncing ${requests.length} queued requests`);

    // Process each queued request
    for (const queueItem of requests) {
      try {
        const { id, url, method, body, headers } = queueItem;

        // Make the request
        const response = await fetch(url, {
          method,
          headers: headers || { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (response.ok) {
          // Request succeeded, remove from queue
          await deleteQueuedRequest(db, id);
          console.log(`Successfully synced request ${id}`);
        } else {
          console.error(`Failed to sync request ${id}:`, response.status);
        }
      } catch (error) {
        console.error('Error syncing request:', error);
        // Keep in queue for next sync attempt
      }
    }

    // Notify clients that sync completed
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now(),
      });
    });
  } catch (error) {
    console.error('Error in syncOfflineQueue:', error);
    throw error;
  }
}

// IndexedDB helpers for offline queue
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fitlog-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-queue')) {
        const store = db.createObjectStore('offline-queue', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

function getAllQueuedRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offline-queue'], 'readonly');
    const store = transaction.objectStore('offline-queue');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteQueuedRequest(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offline-queue'], 'readwrite');
    const store = transaction.objectStore('offline-queue');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
