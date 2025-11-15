/**
 * Input Validation Utilities
 *
 * Client-side validation functions to complement server-side validation.
 * Never trust client-side validation alone - always validate on server too.
 */

import {
  TEXT_LIMITS,
  EXERCISE_LIMITS,
  BODY_METRICS
} from '../../../shared/constants/validation';

/**
 * Validates a workout name ensuring it's not empty and within length limits.
 *
 * @param {string} name - The workout name to validate
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateWorkoutName('Morning Cardio') // { isValid: true, error: null }
 * validateWorkoutName('') // { isValid: false, error: 'Workout name cannot be empty' }
 */
export const validateWorkoutName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Workout name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Workout name cannot be empty' };
  }

  if (trimmed.length > TEXT_LIMITS.WORKOUT_NAME_MAX) {
    return { isValid: false, error: `Workout name must be ${TEXT_LIMITS.WORKOUT_NAME_MAX} characters or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates a workout description (optional field) ensuring it's within length limits.
 *
 * @param {string} description - The workout description to validate
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateDescription('Full body workout') // { isValid: true, error: null }
 * validateDescription(null) // { isValid: true, error: null } - optional field
 */
export const validateDescription = (description) => {
  if (!description) {
    return { isValid: true, error: null }; // Optional field
  }

  if (typeof description !== 'string') {
    return { isValid: false, error: 'Description must be text' };
  }

  if (description.length > TEXT_LIMITS.DESCRIPTION_MAX) {
    return { isValid: false, error: `Description must be ${TEXT_LIMITS.DESCRIPTION_MAX} characters or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates an exercise name ensuring it's not empty and within length limits.
 *
 * @param {string} name - The exercise name to validate
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateExerciseName('Bench Press') // { isValid: true, error: null }
 * validateExerciseName('   ') // { isValid: false, error: 'Exercise name cannot be empty' }
 */
export const validateExerciseName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Exercise name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Exercise name cannot be empty' };
  }

  if (trimmed.length > TEXT_LIMITS.EXERCISE_NAME_MAX) {
    return { isValid: false, error: `Exercise name must be ${TEXT_LIMITS.EXERCISE_NAME_MAX} characters or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates the number of sets for an exercise ensuring it's within acceptable range.
 *
 * @param {number|string} sets - The number of sets (will be parsed to integer)
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateSets(3) // { isValid: true, error: null }
 * validateSets('5') // { isValid: true, error: null }
 * validateSets('abc') // { isValid: false, error: 'Sets must be a number' }
 */
export const validateSets = (sets) => {
  const num = parseInt(sets, 10);

  if (isNaN(num)) {
    return { isValid: false, error: 'Sets must be a number' };
  }

  if (num < EXERCISE_LIMITS.SETS_MIN) {
    return { isValid: false, error: `Sets must be at least ${EXERCISE_LIMITS.SETS_MIN}` };
  }

  if (num > EXERCISE_LIMITS.SETS_MAX) {
    return { isValid: false, error: `Sets must be ${EXERCISE_LIMITS.SETS_MAX} or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates the number of reps for an exercise ensuring it's within acceptable range.
 *
 * @param {number|string} reps - The number of reps (will be parsed to integer)
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateReps(10) // { isValid: true, error: null }
 * validateReps('12') // { isValid: true, error: null }
 * validateReps(0) // { isValid: false, error: 'Reps must be at least 1' }
 */
export const validateReps = (reps) => {
  const num = parseInt(reps, 10);

  if (isNaN(num)) {
    return { isValid: false, error: 'Reps must be a number' };
  }

  if (num < EXERCISE_LIMITS.REPS_MIN) {
    return { isValid: false, error: `Reps must be at least ${EXERCISE_LIMITS.REPS_MIN}` };
  }

  if (num > EXERCISE_LIMITS.REPS_MAX) {
    return { isValid: false, error: `Reps must be ${EXERCISE_LIMITS.REPS_MAX} or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates exercise weight ensuring it's a valid number within acceptable range.
 *
 * @param {number|string} weight - The weight value (will be parsed to float)
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateWeight(100) // { isValid: true, error: null }
 * validateWeight('75.5') // { isValid: true, error: null }
 * validateWeight(-10) // { isValid: false, error: 'Weight cannot be negative' }
 */
export const validateWeight = (weight) => {
  const num = parseFloat(weight);

  if (isNaN(num)) {
    return { isValid: false, error: 'Weight must be a number' };
  }

  if (num < EXERCISE_LIMITS.WEIGHT_MIN) {
    return { isValid: false, error: 'Weight cannot be negative' };
  }

  if (num > EXERCISE_LIMITS.WEIGHT_MAX) {
    return { isValid: false, error: `Weight must be ${EXERCISE_LIMITS.WEIGHT_MAX} or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates body weight ensuring it's within realistic human body weight range.
 *
 * @param {number|string} weight - The body weight in kg or lbs (will be parsed to float)
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateBodyWeight(70) // { isValid: true, error: null }
 * validateBodyWeight('165.5') // { isValid: true, error: null }
 * validateBodyWeight(1000) // { isValid: false, error: 'Weight must be 999 or less' }
 */
export const validateBodyWeight = (weight) => {
  const num = parseFloat(weight);

  if (isNaN(num)) {
    return { isValid: false, error: 'Weight must be a number' };
  }

  if (num < BODY_METRICS.WEIGHT_MIN) {
    return { isValid: false, error: `Weight must be at least ${BODY_METRICS.WEIGHT_MIN}` };
  }

  if (num > BODY_METRICS.WEIGHT_MAX) {
    return { isValid: false, error: `Weight must be ${BODY_METRICS.WEIGHT_MAX} or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates body fat percentage ensuring it's within realistic human range.
 *
 * @param {number|string} percentage - The body fat percentage (will be parsed to float)
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateBodyFatPercentage(15) // { isValid: true, error: null }
 * validateBodyFatPercentage('22.5') // { isValid: true, error: null }
 * validateBodyFatPercentage(100) // { isValid: false, error: 'Body fat percentage must be 70% or less' }
 */
export const validateBodyFatPercentage = (percentage) => {
  const num = parseFloat(percentage);

  if (isNaN(num)) {
    return { isValid: false, error: 'Body fat percentage must be a number' };
  }

  if (num < BODY_METRICS.BODYFAT_MIN) {
    return { isValid: false, error: `Body fat percentage must be at least ${BODY_METRICS.BODYFAT_MIN}%` };
  }

  if (num > BODY_METRICS.BODYFAT_MAX) {
    return { isValid: false, error: `Body fat percentage must be ${BODY_METRICS.BODYFAT_MAX}% or less` };
  }

  return { isValid: true, error: null };
};

/**
 * Validates a date string ensuring it's valid and not in the future.
 *
 * @param {string} dateString - The date string to validate (ISO format or parseable date)
 * @returns {{isValid: boolean, error: string|null}} Validation result with error message if invalid
 * @example
 * validateDate('2024-01-15') // { isValid: true, error: null }
 * validateDate('invalid-date') // { isValid: false, error: 'Invalid date format' }
 * validateDate('2099-12-31') // { isValid: false, error: 'Date cannot be in the future' }
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
