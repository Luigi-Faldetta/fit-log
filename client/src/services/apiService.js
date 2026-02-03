// src/services/apiService.js
import { fetchWithErrorHandling, logError } from '../utils/errorHandling';
import { authFetch } from './authFetch';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost'
).replace(/\/$/, '');

/**
 * Health check endpoint to verify API availability.
 *
 * @returns {Promise<Object>} Health check response
 * @throws {ApiError|NetworkError} When health check fails
 */
export const checkHealth = async () => {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/health`);
  } catch (error) {
    logError(error, 'Health check');
    throw error;
  }
};

/**
 * Fetches all workouts for the current user.
 *
 * @returns {Promise<Array>} Array of workout objects
 * @throws {ApiError|NetworkError} When fetch fails
 */
export const getWorkouts = async () => {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/workouts`);
  } catch (error) {
    logError(error, 'Fetching workouts');
    throw error;
  }
};

/**
 * Fetches a single workout by ID.
 *
 * @param {number} workoutId - The workout ID
 * @returns {Promise<Object>} Workout object
 * @throws {ApiError|NetworkError} When fetch fails
 */
export const getWorkout = async (workoutId) => {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/workouts/${workoutId}`);
  } catch (error) {
    logError(error, `Fetching workout ${workoutId}`);
    throw error;
  }
};

/**
 * Deletes a workout by ID.
 *
 * @param {number} workoutId - The workout ID to delete
 * @returns {Promise<void>}
 * @throws {ApiError|NetworkError} When deletion fails
 */
export const deleteWorkout = async (workoutId) => {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/workouts/${workoutId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    logError(error, `Deleting workout ${workoutId}`);
    throw error;
  }
};

export const getExercises = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/exercises`);
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const updateExercises = async (exercises) => {
  console.log(exercises);
  try {
    // Transform exercises to match backend schema (id -> exercise_id)
    const exercisesPayload = {
      exercises: exercises.map(exercise => ({
        exercise_id: exercise.exercise_id || exercise.id,
        name: exercise.name,
        description: exercise.description,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        rest: exercise.rest,
        media_URL: exercise.media_URL
      }))
    };

    const response = await authFetch(`${API_BASE_URL}/exercises`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercisesPayload),
    });
    if (!response.ok) {
      throw new Error('Failed to update exercises');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating exercises:', error);
    throw error;
  }
};

export const postExercise = async (exercise) => {
  try {
    const response = await authFetch(`${API_BASE_URL}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercise),
    });
    if (!response.ok) {
      throw new Error('Failed to create exercise');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const deleteExercise = async (exerciseId) => {
  try {
    const response = await authFetch(`${API_BASE_URL}/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete exercise');
    }
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};

/**
 * Creates a new workout.
 *
 * @param {Object} workout - The workout object to create
 * @returns {Promise<Object>} Created workout object
 * @throws {ApiError|NetworkError|ValidationError} When creation fails
 */
export const postWorkout = async (workout) => {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
  } catch (error) {
    logError(error, 'Creating workout');
    throw error;
  }
};

/**
 * Updates an existing workout.
 *
 * @param {number} workoutId - The workout ID to update
 * @param {Object} workout - The updated workout data
 * @returns {Promise<Object>} Updated workout object
 * @throws {ApiError|NetworkError|ValidationError} When update fails
 */
export const updateWorkout = async (workoutId, workout) => {
  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
  } catch (error) {
    logError(error, `Updating workout ${workoutId}`);
    throw error;
  }
};

// Weight endpoints
export const getWeightData = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/weight`);
    if (!response.ok) {
      throw new Error('Failed to fetch weight data');
    }
    const data = await response.json();
    console.log('getting', data);

    const formattedData = data.map((entry) => ({
      date: entry.date.split('T')[0], // Extract the date in YYYY-MM-DD format
      weight: entry.value, // Use `value` as `weight`
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching weight data:', error);
    throw error;
  }
};

export const postWeightData = async (weightData) => {
  try {
    // The backend is expecting `value` for the weight field
    const requestBody = {
      date: weightData.date,
      value: weightData.weight, // Rename `weight` to `value` to match the backend schema
    };

    const response = await authFetch(`${API_BASE_URL}/weight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to post weight data');
    }

    const data = await response.json();
    // Format the response data to match the expected format
    return {
      date: data.date.split('T')[0],
      weight: data.value,
    };
  } catch (error) {
    console.error('Error posting weight data:', error);
    throw error;
  }
};

// Body Fat endpoints
export const getBodyFatData = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/bodyfat`);
    if (!response.ok) {
      throw new Error('Failed to fetch body fat data');
    }
    const data = await response.json();

    // Map the response to match the expected format
    const formattedData = data.map((entry) => ({
      date: entry.date.split('T')[0], // Extract date in 'YYYY-MM-DD' format
      bodyFat: entry.value, // Use `value` as `bodyFat`
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching body fat data:', error);
    throw error;
  }
};

export const postBodyFatData = async (bodyFatData) => {
  try {
    const requestBody = {
      date: bodyFatData.date,
      value: bodyFatData.bodyFat, // Rename `bodyFat` to `value` to match backend schema
    };

    const response = await authFetch(`${API_BASE_URL}/bodyfat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to post body fat data');
    }

    const data = await response.json();
    // Format the response data to match the expected format
    return {
      date: data.date.split('T')[0],
      bodyFat: data.value,
    };
  } catch (error) {
    console.error('Error posting body fat data:', error);
    throw error;
  }
};
