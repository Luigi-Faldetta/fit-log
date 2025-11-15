import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { workoutDataService } from '../services/workoutDataService';

/**
 * Workouts Context
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for managing workout state
 * - Delegates data fetching to workoutDataService
 * - Delegates caching to workoutDataService
 * - No business logic, just state management
 */

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
      if (isInitialized) return;

      try {
        setLoading(true);
        setError(null);

        // Use data service to handle fetching and caching
        const result = await workoutDataService.getAll();

        // Show cached data immediately if available
        if (result.cachedData) {
          console.log('Loading workouts from cache');
          setWorkouts(result.cachedData);
          setLoading(false);
        }

        // Update with fresh data
        setWorkouts(result.data);

        // Set error if using stale cache
        if (result.fromCache && result.error) {
          setError(result.error);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        setError(error.message || 'Failed to load workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [isInitialized]);

  // Manually refresh workouts
  const refreshWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await workoutDataService.getAll();
      setWorkouts(result.data);

      if (result.fromCache && result.error) {
        setError(result.error);
      }

      return result.data;
    } catch (error) {
      console.error('Failed to refresh workouts:', error);
      setError(error.message || 'Failed to refresh workouts. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add workout to state and cache (optimistic update)
  const addWorkoutToCache = useCallback(async (workout) => {
    setWorkouts(prev => [...prev, workout]);

    try {
      await workoutDataService.updateCache(workout);
    } catch (error) {
      console.error('Failed to cache workout:', error);
    }
  }, []);

  // Update workout in state and cache (optimistic update)
  const updateWorkoutInCache = useCallback(async (workoutId, updatedWorkout) => {
    setWorkouts(prev =>
      prev.map(w => w.workout_id === workoutId ? updatedWorkout : w)
    );

    try {
      await workoutDataService.updateCache(updatedWorkout);
    } catch (error) {
      console.error('Failed to cache updated workout:', error);
    }
  }, []);

  // Remove workout from state and cache (optimistic update)
  const removeWorkoutFromCache = useCallback(async (workoutId) => {
    setWorkouts(prev => prev.filter(w => w.workout_id !== workoutId));

    try {
      await workoutDataService.deleteFromCache(workoutId);
    } catch (error) {
      console.error('Failed to remove workout from cache:', error);
    }
  }, []);

  const value = useMemo(() => ({
    workouts,
    loading,
    error,
    isInitialized,
    refreshWorkouts,
    addWorkoutToCache,
    updateWorkoutInCache,
    removeWorkoutFromCache
  }), [
    workouts,
    loading,
    error,
    isInitialized,
    refreshWorkouts,
    addWorkoutToCache,
    updateWorkoutInCache,
    removeWorkoutFromCache
  ]);

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
};
