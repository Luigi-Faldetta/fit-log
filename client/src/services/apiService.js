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
