// src/services/apiService.js

const API_BASE_URL = 'http://localhost:3000';

export const getWorkouts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const getWorkout = async (workoutId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch workout');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete workout');
    }
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

export const getExercises = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercises`);
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const updateExercises = async (exercises) => {
  console.log(exercises);
  try {
    const response = await fetch(`${API_BASE_URL}/exercises`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercises),
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
    const response = await fetch(`${API_BASE_URL}/exercises`, {
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
    return data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const postWorkout = async (workout) => {
  try {
    console.log(workout);
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    if (!response.ok) {
      throw new Error('Failed to create workout');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

// src/services/apiService.js

export const updateWorkout = async (workoutId, workout) => {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    if (!response.ok) {
      throw new Error('Failed to update workout');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};
