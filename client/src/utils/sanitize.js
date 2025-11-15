/**
 * Input Sanitization Utilities
 *
 * Provides functions to sanitize user input and prevent XSS attacks.
 * Uses DOMPurify for HTML sanitization.
 */

import DOMPurify from 'dompurify';
import {
  TEXT_LIMITS,
  EXERCISE_LIMITS
} from '../../../shared/constants/validation';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Potentially unsafe HTML string
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed by default
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true // Keep text content, remove tags
  });
};

/**
 * Sanitize text input (removes all HTML, keeps only text)
 * @param {string} input - User input string
 * @returns {string} - Sanitized string with HTML stripped
 */
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') return '';

  // Remove all HTML tags and decode HTML entities
  const stripped = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });

  // Trim whitespace
  return stripped.trim();
};

/**
 * Sanitize number input
 * @param {string|number} input - Number input
 * @param {object} options - Validation options
 * @returns {number|null} - Sanitized number or null if invalid
 */
export const sanitizeNumber = (input, options = {}) => {
  const { min = -Infinity, max = Infinity, allowDecimals = true } = options;

  if (input === '' || input === null || input === undefined) return null;

  const num = allowDecimals ? parseFloat(input) : parseInt(input, 10);

  if (isNaN(num)) return null;
  if (num < min || num > max) return null;

  return num;
};

/**
 * Sanitize workout name
 * @param {string} name - Workout name
 * @returns {string} - Sanitized workout name
 */
export const sanitizeWorkoutName = (name) => {
  const sanitized = sanitizeText(name);
  return sanitized.slice(0, TEXT_LIMITS.WORKOUT_NAME_MAX);
};

/**
 * Sanitize workout description
 * @param {string} description - Workout description
 * @returns {string} - Sanitized description
 */
export const sanitizeDescription = (description) => {
  const sanitized = sanitizeText(description);
  return sanitized.slice(0, TEXT_LIMITS.DESCRIPTION_MAX);
};

/**
 * Sanitize exercise name
 * @param {string} name - Exercise name
 * @returns {string} - Sanitized exercise name
 */
export const sanitizeExerciseName = (name) => {
  const sanitized = sanitizeText(name);
  return sanitized.slice(0, TEXT_LIMITS.EXERCISE_NAME_MAX);
};

/**
 * Sanitize sets/reps/weight values
 * @param {string|number} value - Sets, reps, or weight value
 * @returns {number|null} - Sanitized numeric value
 */
export const sanitizeExerciseValue = (value) => {
  return sanitizeNumber(value, {
    min: EXERCISE_LIMITS.WEIGHT_MIN,
    max: EXERCISE_LIMITS.WEIGHT_MAX,
    allowDecimals: true
  });
};

/**
 * Sanitize date input
 * @param {string} dateString - Date string
 * @returns {string|null} - Valid ISO date string or null
 */
export const sanitizeDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  // Ensure date is not in the future
  const now = new Date();
  if (date > now) return null;

  return date.toISOString().split('T')[0];
};

/**
 * Sanitize AI-generated text before parsing
 * Prevents script injection in AI responses
 * @param {string} aiText - Text from AI
 * @returns {string} - Sanitized text
 */
export const sanitizeAIResponse = (aiText) => {
  if (!aiText || typeof aiText !== 'string') return '';

  // Remove any potential script tags or dangerous content
  const sanitized = DOMPurify.sanitize(aiText, {
    ALLOWED_TAGS: [], // No HTML at all
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });

  // Remove any remaining control characters except newlines and tabs
  return sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * Validate and sanitize email
 * @param {string} email - Email address
 * @returns {string|null} - Sanitized email or null if invalid
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;

  const sanitized = sanitizeText(email);

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) return null;

  return sanitized.toLowerCase();
};
