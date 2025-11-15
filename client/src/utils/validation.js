/**
 * Input Validation Utilities
 *
 * Client-side validation functions to complement server-side validation.
 * Never trust client-side validation alone - always validate on server too.
 */

/**
 * Validate workout name
 * @param {string} name - Workout name
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateWorkoutName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Workout name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Workout name cannot be empty' };
  }

  if (trimmed.length > 255) {
    return { isValid: false, error: 'Workout name must be 255 characters or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate workout description
 * @param {string} description - Workout description
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateDescription = (description) => {
  if (!description) {
    return { isValid: true, error: null }; // Optional field
  }

  if (typeof description !== 'string') {
    return { isValid: false, error: 'Description must be text' };
  }

  if (description.length > 1000) {
    return { isValid: false, error: 'Description must be 1000 characters or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate exercise name
 * @param {string} name - Exercise name
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateExerciseName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Exercise name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Exercise name cannot be empty' };
  }

  if (trimmed.length > 255) {
    return { isValid: false, error: 'Exercise name must be 255 characters or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate sets value
 * @param {number|string} sets - Number of sets
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateSets = (sets) => {
  const num = parseInt(sets, 10);

  if (isNaN(num)) {
    return { isValid: false, error: 'Sets must be a number' };
  }

  if (num < 1) {
    return { isValid: false, error: 'Sets must be at least 1' };
  }

  if (num > 100) {
    return { isValid: false, error: 'Sets must be 100 or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate reps value
 * @param {number|string} reps - Number of reps
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateReps = (reps) => {
  const num = parseInt(reps, 10);

  if (isNaN(num)) {
    return { isValid: false, error: 'Reps must be a number' };
  }

  if (num < 1) {
    return { isValid: false, error: 'Reps must be at least 1' };
  }

  if (num > 1000) {
    return { isValid: false, error: 'Reps must be 1000 or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate weight value
 * @param {number|string} weight - Weight value
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateWeight = (weight) => {
  const num = parseFloat(weight);

  if (isNaN(num)) {
    return { isValid: false, error: 'Weight must be a number' };
  }

  if (num < 0) {
    return { isValid: false, error: 'Weight cannot be negative' };
  }

  if (num > 10000) {
    return { isValid: false, error: 'Weight must be 10000 or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate body weight value
 * @param {number|string} weight - Body weight in kg or lbs
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateBodyWeight = (weight) => {
  const num = parseFloat(weight);

  if (isNaN(num)) {
    return { isValid: false, error: 'Weight must be a number' };
  }

  if (num < 20) {
    return { isValid: false, error: 'Weight must be at least 20' };
  }

  if (num > 500) {
    return { isValid: false, error: 'Weight must be 500 or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate body fat percentage
 * @param {number|string} percentage - Body fat percentage
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateBodyFatPercentage = (percentage) => {
  const num = parseFloat(percentage);

  if (isNaN(num)) {
    return { isValid: false, error: 'Body fat percentage must be a number' };
  }

  if (num < 1) {
    return { isValid: false, error: 'Body fat percentage must be at least 1%' };
  }

  if (num > 70) {
    return { isValid: false, error: 'Body fat percentage must be 70% or less' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate date
 * @param {string} dateString - Date string
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateDate = (dateString) => {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  const now = new Date();
  if (date > now) {
    return { isValid: false, error: 'Date cannot be in the future' };
  }

  return { isValid: true, error: null };
};
