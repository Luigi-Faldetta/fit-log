import { openDB } from 'idb';

const DB_NAME = 'fitlog-db';
const DB_VERSION = 1;

// Store names
const STORES = {
  WORKOUTS: 'workouts',
  EXERCISES: 'exercises',
  WEIGHT: 'weight',
  BODYFAT: 'bodyfat',
  OFFLINE_QUEUE: 'offline-queue',
};

/**
 * Initialize the IndexedDB database
 */
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create workouts store
      if (!db.objectStoreNames.contains(STORES.WORKOUTS)) {
        const workoutStore = db.createObjectStore(STORES.WORKOUTS, {
          keyPath: 'id',
        });
        workoutStore.createIndex('date', 'date');
        workoutStore.createIndex('userId', 'userId');
      }

      // Create exercises store
      if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
        const exerciseStore = db.createObjectStore(STORES.EXERCISES, {
          keyPath: 'id',
        });
        exerciseStore.createIndex('workoutId', 'workoutId');
      }

      // Create weight store
      if (!db.objectStoreNames.contains(STORES.WEIGHT)) {
        const weightStore = db.createObjectStore(STORES.WEIGHT, {
          keyPath: 'id',
        });
        weightStore.createIndex('date', 'date');
        weightStore.createIndex('userId', 'userId');
      }

      // Create bodyfat store
      if (!db.objectStoreNames.contains(STORES.BODYFAT)) {
        const bodyfatStore = db.createObjectStore(STORES.BODYFAT, {
          keyPath: 'id',
        });
        bodyfatStore.createIndex('date', 'date');
        bodyfatStore.createIndex('userId', 'userId');
      }

      // Create offline queue store
      if (!db.objectStoreNames.contains(STORES.OFFLINE_QUEUE)) {
        const queueStore = db.createObjectStore(STORES.OFFLINE_QUEUE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        queueStore.createIndex('timestamp', 'timestamp');
        queueStore.createIndex('type', 'type');
      }
    },
  });
};

// Workouts operations
export const workoutsDB = {
  async getAll() {
    const db = await initDB();
    return db.getAll(STORES.WORKOUTS);
  },

  async get(id) {
    const db = await initDB();
    return db.get(STORES.WORKOUTS, id);
  },

  async add(workout) {
    const db = await initDB();
    return db.add(STORES.WORKOUTS, workout);
  },

  async put(workout) {
    const db = await initDB();
    // Ensure workout has an id field (map workout_id to id if needed)
    const workoutWithId = {
      ...workout,
      id: workout.id || workout.workout_id
    };
    return db.put(STORES.WORKOUTS, workoutWithId);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete(STORES.WORKOUTS, id);
  },

  async clear() {
    const db = await initDB();
    return db.clear(STORES.WORKOUTS);
  },

  async sync(workouts) {
    const db = await initDB();
    const tx = db.transaction(STORES.WORKOUTS, 'readwrite');
    await tx.store.clear();
    // Map workout_id to id for IndexedDB
    await Promise.all(workouts.map((workout) => tx.store.put({
      ...workout,
      id: workout.workout_id || workout.id
    })));
    await tx.done;
  },
};

// Exercises operations
export const exercisesDB = {
  async getAll() {
    const db = await initDB();
    return db.getAll(STORES.EXERCISES);
  },

  async get(id) {
    const db = await initDB();
    return db.get(STORES.EXERCISES, id);
  },

  async getByWorkoutId(workoutId) {
    const db = await initDB();
    return db.getAllFromIndex(STORES.EXERCISES, 'workoutId', workoutId);
  },

  async add(exercise) {
    const db = await initDB();
    return db.add(STORES.EXERCISES, exercise);
  },

  async put(exercise) {
    const db = await initDB();
    // Ensure exercise has an id field (map exercise_id to id if needed)
    const exerciseWithId = {
      ...exercise,
      id: exercise.id || exercise.exercise_id
    };
    return db.put(STORES.EXERCISES, exerciseWithId);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete(STORES.EXERCISES, id);
  },

  async deleteByWorkoutId(workoutId) {
    const db = await initDB();
    const exercises = await db.getAllFromIndex(
      STORES.EXERCISES,
      'workoutId',
      workoutId
    );
    const tx = db.transaction(STORES.EXERCISES, 'readwrite');
    await Promise.all(exercises.map((ex) => tx.store.delete(ex.id)));
    await tx.done;
  },

  async clear() {
    const db = await initDB();
    return db.clear(STORES.EXERCISES);
  },

  async sync(exercises) {
    const db = await initDB();
    const tx = db.transaction(STORES.EXERCISES, 'readwrite');
    await tx.store.clear();
    await Promise.all(exercises.map((exercise) => tx.store.put(exercise)));
    await tx.done;
  },
};

// Weight operations
export const weightDB = {
  async getAll() {
    const db = await initDB();
    return db.getAll(STORES.WEIGHT);
  },

  async get(id) {
    const db = await initDB();
    return db.get(STORES.WEIGHT, id);
  },

  async add(weight) {
    const db = await initDB();
    return db.add(STORES.WEIGHT, weight);
  },

  async put(weight) {
    const db = await initDB();
    // Ensure weight has an id field (map weight_id to id if needed)
    const weightWithId = {
      ...weight,
      id: weight.id || weight.weight_id
    };
    return db.put(STORES.WEIGHT, weightWithId);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete(STORES.WEIGHT, id);
  },

  async clear() {
    const db = await initDB();
    return db.clear(STORES.WEIGHT);
  },

  async sync(weights) {
    const db = await initDB();
    const tx = db.transaction(STORES.WEIGHT, 'readwrite');
    await tx.store.clear();
    // Map weight_id to id for IndexedDB
    await Promise.all(weights.map((weight) => tx.store.put({
      ...weight,
      id: weight.weight_id || weight.id
    })));
    await tx.done;
  },
};

// Body fat operations
export const bodyfatDB = {
  async getAll() {
    const db = await initDB();
    return db.getAll(STORES.BODYFAT);
  },

  async get(id) {
    const db = await initDB();
    return db.get(STORES.BODYFAT, id);
  },

  async add(bodyfat) {
    const db = await initDB();
    return db.add(STORES.BODYFAT, bodyfat);
  },

  async put(bodyfat) {
    const db = await initDB();
    // Ensure bodyfat has an id field (map bodyfat_id to id if needed)
    const bodyfatWithId = {
      ...bodyfat,
      id: bodyfat.id || bodyfat.bodyfat_id
    };
    return db.put(STORES.BODYFAT, bodyfatWithId);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete(STORES.BODYFAT, id);
  },

  async clear() {
    const db = await initDB();
    return db.clear(STORES.BODYFAT);
  },

  async sync(bodyfats) {
    const db = await initDB();
    const tx = db.transaction(STORES.BODYFAT, 'readwrite');
    await tx.store.clear();
    // Map bodyfat_id to id for IndexedDB
    await Promise.all(bodyfats.map((bodyfat) => tx.store.put({
      ...bodyfat,
      id: bodyfat.bodyfat_id || bodyfat.id
    })));
    await tx.done;
  },
};

// Offline queue operations
export const offlineQueueDB = {
  async getAll() {
    const db = await initDB();
    return db.getAll(STORES.OFFLINE_QUEUE);
  },

  async add(request) {
    const db = await initDB();
    const queueItem = {
      ...request,
      timestamp: Date.now(),
    };
    return db.add(STORES.OFFLINE_QUEUE, queueItem);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete(STORES.OFFLINE_QUEUE, id);
  },

  async clear() {
    const db = await initDB();
    return db.clear(STORES.OFFLINE_QUEUE);
  },

  async getAllPending() {
    const db = await initDB();
    const allItems = await db.getAll(STORES.OFFLINE_QUEUE);
    return allItems.sort((a, b) => a.timestamp - b.timestamp);
  },
};

// Clear all data (useful for logout or reset)
export const clearAllData = async () => {
  const db = await initDB();
  const tx = db.transaction(
    [
      STORES.WORKOUTS,
      STORES.EXERCISES,
      STORES.WEIGHT,
      STORES.BODYFAT,
      STORES.OFFLINE_QUEUE,
    ],
    'readwrite'
  );

  await Promise.all([
    tx.objectStore(STORES.WORKOUTS).clear(),
    tx.objectStore(STORES.EXERCISES).clear(),
    tx.objectStore(STORES.WEIGHT).clear(),
    tx.objectStore(STORES.BODYFAT).clear(),
    tx.objectStore(STORES.OFFLINE_QUEUE).clear(),
  ]);

  await tx.done;
};

export default {
  workoutsDB,
  exercisesDB,
  weightDB,
  bodyfatDB,
  offlineQueueDB,
  clearAllData,
};
