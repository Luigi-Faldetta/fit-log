import { offlineQueueDB } from './dbService';

const QUEUE_NAME = 'fitlog-offline-queue';

/**
 * Add a failed request to the offline queue
 * @param {Object} request - Request details
 * @param {string} request.url - Request URL
 * @param {string} request.method - HTTP method (POST, PUT, DELETE)
 * @param {Object} request.body - Request body
 * @param {Object} request.headers - Request headers
 * @param {string} request.type - Request type (workout, exercise, weight, bodyfat)
 */
export const queueRequest = async (request) => {
  try {
    const queueItem = {
      url: request.url,
      method: request.method,
      body: request.body,
      headers: request.headers || { 'Content-Type': 'application/json' },
      type: request.type,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await offlineQueueDB.add(queueItem);
    console.log('Request queued for offline sync:', queueItem);

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await registration.sync.register(QUEUE_NAME);
        console.log('Background sync registered');
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error queueing request:', error);
    return false;
  }
};

/**
 * Process the offline queue manually (fallback if background sync not available)
 */
export const processQueue = async () => {
  try {
    const queuedRequests = await offlineQueueDB.getAllPending();

    if (queuedRequests.length === 0) {
      console.log('No requests in offline queue');
      return { success: 0, failed: 0 };
    }

    console.log(`Processing ${queuedRequests.length} queued requests`);

    let successCount = 0;
    let failedCount = 0;

    for (const queueItem of queuedRequests) {
      try {
        const response = await fetch(queueItem.url, {
          method: queueItem.method,
          headers: queueItem.headers,
          body: queueItem.body ? JSON.stringify(queueItem.body) : undefined,
        });

        if (response.ok) {
          // Request succeeded, remove from queue
          await offlineQueueDB.delete(queueItem.id);
          successCount++;
          console.log(`Successfully processed queued request ${queueItem.id}`);
        } else {
          // Request failed, increment retry count
          failedCount++;
          console.error(`Failed to process request ${queueItem.id}:`, response.status);

          // Update retry count
          queueItem.retryCount = (queueItem.retryCount || 0) + 1;

          // Remove from queue if max retries reached (e.g., 5 attempts)
          if (queueItem.retryCount >= 5) {
            await offlineQueueDB.delete(queueItem.id);
            console.warn(`Max retries reached for request ${queueItem.id}, removing from queue`);
          }
        }
      } catch (error) {
        failedCount++;
        console.error('Error processing queued request:', error);
      }
    }

    return { success: successCount, failed: failedCount };
  } catch (error) {
    console.error('Error processing offline queue:', error);
    return { success: 0, failed: 0 };
  }
};

/**
 * Get the count of pending requests in the queue
 */
export const getQueueCount = async () => {
  try {
    const requests = await offlineQueueDB.getAllPending();
    return requests.length;
  } catch (error) {
    console.error('Error getting queue count:', error);
    return 0;
  }
};

/**
 * Clear all requests from the queue
 */
export const clearQueue = async () => {
  try {
    await offlineQueueDB.clear();
    console.log('Offline queue cleared');
    return true;
  } catch (error) {
    console.error('Error clearing queue:', error);
    return false;
  }
};

/**
 * Retry a specific request from the queue
 */
export const retryRequest = async (requestId) => {
  try {
    const requests = await offlineQueueDB.getAllPending();
    const request = requests.find((r) => r.id === requestId);

    if (!request) {
      console.error('Request not found in queue:', requestId);
      return false;
    }

    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    if (response.ok) {
      await offlineQueueDB.delete(requestId);
      console.log('Request retry successful:', requestId);
      return true;
    } else {
      console.error('Request retry failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error retrying request:', error);
    return false;
  }
};

/**
 * Listen for sync events from service worker
 */
export const setupSyncListener = (callback) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        console.log('Sync completed at:', new Date(event.data.timestamp));
        if (callback) {
          callback(event.data);
        }
      }
    });
  }
};

export default {
  queueRequest,
  processQueue,
  getQueueCount,
  clearQueue,
  retryRequest,
  setupSyncListener,
};
