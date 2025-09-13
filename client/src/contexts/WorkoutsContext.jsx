import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWorkouts } from '../services/apiService';

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
        const data = await getWorkouts();
        setWorkouts(data);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        setError('Failed to load workouts. Please try again later.');
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
      const data = await getWorkouts();
      setWorkouts(data);
      return data;
    } catch (error) {
      console.error('Failed to refresh workouts:', error);
      setError('Failed to refresh workouts. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to add a workout to the cached list
  const addWorkoutToCache = (workout) => {
    setWorkouts(prev => [...prev, workout]);
  };

  // Function to update a workout in the cached list
  const updateWorkoutInCache = (workoutId, updatedWorkout) => {
    setWorkouts(prev =>
      prev.map(w => w.workout_id === workoutId ? updatedWorkout : w)
    );
  };

  // Function to remove a workout from the cached list
  const removeWorkoutFromCache = (workoutId) => {
    setWorkouts(prev => prev.filter(w => w.workout_id !== workoutId));
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