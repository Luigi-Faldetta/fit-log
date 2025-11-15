import { workoutsDB, exercisesDB, weightDB, bodyfatDB } from './dbService';
import { queueRequest } from './offlineQueue';

/**
 * Retry logic with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the function
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if offline or 4xx errors (except 408, 429)
      if (!navigator.onLine) {
        throw error;
      }

      const status = error.response?.status;
      if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

      // Don't wait after the last attempt
      if (attempt < maxRetries - 1) {
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Offline-first fetch wrapper
 * Tries IndexedDB first, then network, with fallback to cache
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {Object} dbConfig - Database configuration
 * @returns {Promise} Response data
 */
export const offlineFirstFetch = async (url, options = {}, dbConfig = {}) => {
  const { db, syncToDb = true } = dbConfig;

  // For GET requests, try IndexedDB first
  if (!options.method || options.method === 'GET') {
    if (db) {
      try {
        const cachedData = await db.getAll();
        if (cachedData && cachedData.length > 0) {
          console.log('Using cached data from IndexedDB');

          // Try to update in the background if online
          if (navigator.onLine) {
            fetch(url, options)
              .then(async (response) => {
                if (response.ok) {
                  const data = await response.json();
                  if (syncToDb && db) {
                    await db.sync(data);
                    console.log('Background sync completed');
                  }
                }
              })
              .catch((error) => {
                console.warn('Background sync failed:', error);
              });
          }

          return cachedData;
        }
      } catch (error) {
        console.warn('Error reading from IndexedDB:', error);
      }
    }
  }

  // Try network request with retry
  try {
    const data = await retryWithBackoff(async () => {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = response;
        throw error;
      }

      return await response.json();
    });

    // Sync to IndexedDB if successful
    if (syncToDb && db && (!options.method || options.method === 'GET')) {
      try {
        await db.sync(data);
        console.log('Synced data to IndexedDB');
      } catch (error) {
        console.warn('Failed to sync to IndexedDB:', error);
      }
    }

    return data;
  } catch (error) {
    console.error('Network request failed:', error);

    // If offline and it's a mutation, queue it
    if (!navigator.onLine && options.method && options.method !== 'GET') {
      console.log('Offline: Queueing request for later sync');
      await queueRequest({
        url,
        method: options.method,
        body: options.body ? JSON.parse(options.body) : null,
        headers: options.headers,
        type: dbConfig.type || 'unknown',
      });

      // Return optimistic response
      return { queued: true, error: 'Request queued for offline sync' };
    }

    // For GET requests, try to return cached data
    if ((!options.method || options.method === 'GET') && db) {
      try {
        const cachedData = await db.getAll();
        if (cachedData && cachedData.length > 0) {
          console.log('Returning cached data after network failure');
          return cachedData;
        }
      } catch (dbError) {
        console.error('Failed to read from IndexedDB:', dbError);
      }
    }

    throw error;
  }
};

/**
 * Offline-first wrapper for workouts API
 */
export const workoutsOfflineAPI = {
  async getAll() {
    return offlineFirstFetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/workouts`,
      { method: 'GET' },
      { db: workoutsDB, type: 'workout' }
    );
  },

  async get(id) {
    return offlineFirstFetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/workouts/${id}`,
      { method: 'GET' },
      { db: workoutsDB, type: 'workout' }
    );
  },

  async create(workout) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/workouts`;

    if (!navigator.onLine) {
      // Store optimistically in IndexedDB
      const tempId = `temp-${Date.now()}`;
      const optimisticWorkout = { ...workout, id: tempId, _pending: true };
      await workoutsDB.put(optimisticWorkout);

      // Queue for sync
      await queueRequest({
        url,
        method: 'POST',
        body: workout,
        headers: { 'Content-Type': 'application/json' },
        type: 'workout',
      });

      return optimisticWorkout;
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      if (!response.ok) throw new Error('Failed to create workout');

      const data = await response.json();
      await workoutsDB.put(data);
      return data;
    });
  },

  async update(id, workout) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/workouts/${id}`;

    if (!navigator.onLine) {
      // Update optimistically in IndexedDB
      await workoutsDB.put({ ...workout, id, _pending: true });

      // Queue for sync
      await queueRequest({
        url,
        method: 'PUT',
        body: workout,
        headers: { 'Content-Type': 'application/json' },
        type: 'workout',
      });

      return { ...workout, id };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });

      if (!response.ok) throw new Error('Failed to update workout');

      const data = await response.json();
      await workoutsDB.put(data);
      return data;
    });
  },

  async delete(id) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/workouts/${id}`;

    if (!navigator.onLine) {
      // Delete optimistically from IndexedDB
      await workoutsDB.delete(id);

      // Queue for sync
      await queueRequest({
        url,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        type: 'workout',
      });

      return { success: true };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete workout');

      await workoutsDB.delete(id);
      return { success: true };
    });
  },
};

/**
 * Offline-first wrapper for exercises API
 */
export const exercisesOfflineAPI = {
  async getAll() {
    return offlineFirstFetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/exercises`,
      { method: 'GET' },
      { db: exercisesDB, type: 'exercise' }
    );
  },

  async create(exercise) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/exercises`;

    if (!navigator.onLine) {
      const tempId = `temp-${Date.now()}`;
      const optimisticExercise = { ...exercise, id: tempId, _pending: true };
      await exercisesDB.put(optimisticExercise);

      await queueRequest({
        url,
        method: 'POST',
        body: exercise,
        headers: { 'Content-Type': 'application/json' },
        type: 'exercise',
      });

      return optimisticExercise;
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) throw new Error('Failed to create exercise');

      const data = await response.json();
      await exercisesDB.put(data);
      return data;
    });
  },

  async update(exercises) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/exercises`;

    if (!navigator.onLine) {
      // Update optimistically in IndexedDB
      for (const exercise of exercises) {
        await exercisesDB.put({ ...exercise, _pending: true });
      }

      await queueRequest({
        url,
        method: 'PUT',
        body: exercises,
        headers: { 'Content-Type': 'application/json' },
        type: 'exercise',
      });

      return exercises;
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercises),
      });

      if (!response.ok) throw new Error('Failed to update exercises');

      const data = await response.json();
      await exercisesDB.sync(data);
      return data;
    });
  },

  async delete(id) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/exercises/${id}`;

    if (!navigator.onLine) {
      await exercisesDB.delete(id);

      await queueRequest({
        url,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        type: 'exercise',
      });

      return { success: true };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete exercise');

      await exercisesDB.delete(id);
      return { success: true };
    });
  },
};

/**
 * Offline-first wrapper for weight API
 */
export const weightOfflineAPI = {
  async getAll() {
    const data = await offlineFirstFetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/weight`,
      { method: 'GET' },
      { db: weightDB, type: 'weight' }
    );

    // Format data
    return data.map((entry) => ({
      date: entry.date?.split('T')[0] || entry.date,
      weight: entry.value || entry.weight,
    }));
  },

  async create(weightData) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/weight`;
    const requestBody = {
      date: weightData.date,
      value: weightData.weight,
    };

    if (!navigator.onLine) {
      const tempId = `temp-${Date.now()}`;
      await weightDB.put({ ...requestBody, id: tempId, _pending: true });

      await queueRequest({
        url,
        method: 'POST',
        body: requestBody,
        headers: { 'Content-Type': 'application/json' },
        type: 'weight',
      });

      return { date: weightData.date, weight: weightData.weight };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to post weight data');

      const data = await response.json();
      await weightDB.put(data);
      return {
        date: data.date.split('T')[0],
        weight: data.value,
      };
    });
  },

  async delete(id) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/weight/${id}`;

    if (!navigator.onLine) {
      await weightDB.delete(id);

      await queueRequest({
        url,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        type: 'weight',
      });

      return { success: true };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete weight data');

      await weightDB.delete(id);
      return { success: true };
    });
  },
};

/**
 * Offline-first wrapper for body fat API
 */
export const bodyfatOfflineAPI = {
  async getAll() {
    const data = await offlineFirstFetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/bodyfat`,
      { method: 'GET' },
      { db: bodyfatDB, type: 'bodyfat' }
    );

    // Format data
    return data.map((entry) => ({
      date: entry.date?.split('T')[0] || entry.date,
      bodyFat: entry.value || entry.bodyFat,
    }));
  },

  async create(bodyFatData) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/bodyfat`;
    const requestBody = {
      date: bodyFatData.date,
      value: bodyFatData.bodyFat,
    };

    if (!navigator.onLine) {
      const tempId = `temp-${Date.now()}`;
      await bodyfatDB.put({ ...requestBody, id: tempId, _pending: true });

      await queueRequest({
        url,
        method: 'POST',
        body: requestBody,
        headers: { 'Content-Type': 'application/json' },
        type: 'bodyfat',
      });

      return { date: bodyFatData.date, bodyFat: bodyFatData.bodyFat };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to post body fat data');

      const data = await response.json();
      await bodyfatDB.put(data);
      return {
        date: data.date.split('T')[0],
        bodyFat: data.value,
      };
    });
  },

  async delete(id) {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/bodyfat/${id}`;

    if (!navigator.onLine) {
      await bodyfatDB.delete(id);

      await queueRequest({
        url,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        type: 'bodyfat',
      });

      return { success: true };
    }

    return retryWithBackoff(async () => {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete body fat data');

      await bodyfatDB.delete(id);
      return { success: true };
    });
  },
};

export default {
  retryWithBackoff,
  offlineFirstFetch,
  workoutsOfflineAPI,
  exercisesOfflineAPI,
  weightOfflineAPI,
  bodyfatOfflineAPI,
};
