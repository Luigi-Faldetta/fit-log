import React, { createContext, useContext, useState, useEffect } from 'react';
import { workoutsOfflineAPI } from '../services/offlineApiService';
import { workoutsDB } from '../services/dbService';

const WorkoutsContext = createContext();

export const useWorkouts = () => {
  const context = useContext(WorkoutsContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutsProvider');
  }
  return context;
};

export const WorkoutsProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch workouts only once when the provider mounts
  useEffect(() => {
    const fetchWorkouts = async () => {
      // Only fetch if not already initialized
      if (isInitialized) return;

      try {
        setLoading(true);

        // Try to load from IndexedDB first for instant display
        const cachedData = await workoutsDB.getAll();
        if (cachedData && cachedData.length > 0) {
          console.log('Loading workouts from IndexedDB cache');
          setWorkouts(cachedData);
          setLoading(false);
        }

        // Then fetch from API (will use offline-first strategy)
        const data = await workoutsOfflineAPI.getAll();
        setWorkouts(data);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);

        // Try to use cached data as fallback
        try {
          const cachedData = await workoutsDB.getAll();
          if (cachedData && cachedData.length > 0) {
            console.log('Using cached workouts due to fetch error');
            setWorkouts(cachedData);
            setError('Using cached data. Unable to fetch latest workouts.');
          } else {
            setError('Failed to load workouts. Please try again later.');
          }
        } catch (dbError) {
          setError('Failed to load workouts. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [isInitialized]);

  // Function to manually refresh workouts if needed
  const refreshWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutsOfflineAPI.getAll();
      setWorkouts(data);
      return data;
    } catch (error) {
      console.error('Failed to refresh workouts:', error);

      // Fallback to cached data
      try {
        const cachedData = await workoutsDB.getAll();
        if (cachedData && cachedData.length > 0) {
          setWorkouts(cachedData);
          setError('Using cached data. Unable to fetch latest workouts.');
          return cachedData;
        }
      } catch (dbError) {
        console.error('Failed to read from cache:', dbError);
      }

      setError('Failed to refresh workouts. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to add a workout to the cached list and IndexedDB
  const addWorkoutToCache = async (workout) => {
    setWorkouts(prev => [...prev, workout]);
    // Also persist to IndexedDB
    try {
      await workoutsDB.put(workout);
    } catch (error) {
      console.error('Failed to save workout to IndexedDB:', error);
    }
  };

  // Function to update a workout in the cached list and IndexedDB
  const updateWorkoutInCache = async (workoutId, updatedWorkout) => {
    setWorkouts(prev =>
      prev.map(w => w.workout_id === workoutId ? updatedWorkout : w)
    );
    // Also persist to IndexedDB
    try {
      await workoutsDB.put(updatedWorkout);
    } catch (error) {
      console.error('Failed to update workout in IndexedDB:', error);
    }
  };

  // Function to remove a workout from the cached list and IndexedDB
  const removeWorkoutFromCache = async (workoutId) => {
    setWorkouts(prev => prev.filter(w => w.workout_id !== workoutId));
    // Also remove from IndexedDB
    try {
      await workoutsDB.delete(workoutId);
    } catch (error) {
      console.error('Failed to remove workout from IndexedDB:', error);
    }
  };

  const value = {
    workouts,
    loading,
    error,
    isInitialized,
    refreshWorkouts,
    addWorkoutToCache,
    updateWorkoutInCache,
    removeWorkoutFromCache
  };

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
};