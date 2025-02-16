// src/services/apiService.js

const API_BASE_URL = (
  process.env.VITE_API_BASE_URL || 'http://localhost'
).replace(/\/$/, '');

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
    console.log(data);
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
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const deleteExercise = async (exerciseId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`, {
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

// Weight endpoints
export const getWeightData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/weight`);
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

    const response = await fetch(`${API_BASE_URL}/weight`, {
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
    const response = await fetch(`${API_BASE_URL}/bodyfat`);
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

    const response = await fetch(`${API_BASE_URL}/bodyfat`, {
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
