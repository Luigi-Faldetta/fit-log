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
 * Sanitizes HTML content using DOMPurify to prevent XSS attacks.
 * Strips all HTML tags by default, keeping only text content.
 *
 * @param {string} dirty - Potentially unsafe HTML string
 * @returns {string} Sanitized string with all HTML tags removed
 * @example
 * sanitizeHTML('<script>alert("xss")</script>Hello') // 'Hello'
 * sanitizeHTML('<b>Bold text</b>') // 'Bold text'
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
 * Sanitizes text input by removing all HTML tags.
 * Primary function for cleaning user-submitted text fields.
 * Note: Does NOT trim whitespace to allow spaces during typing.
 * Use trimmed versions (sanitizeWorkoutName, etc.) for final values.
 *
 * @param {string} input - User input string that may contain HTML
 * @returns {string} Sanitized string with all HTML stripped (whitespace preserved)
 * @example
 * sanitizeText('<p>Hello World</p>') // 'Hello World'
 * sanitizeText('<img src=x onerror=alert(1)>') // ''
 */
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') return '';

  // Remove all HTML tags and decode HTML entities
  // Whitespace is preserved to allow typing spaces between words
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

/**
 * Sanitizes and validates numeric input with optional constraints.
 *
 * @param {string|number} input - Numeric input to sanitize
 * @param {Object} options - Validation options
 * @param {number} [options.min=-Infinity] - Minimum allowed value
 * @param {number} [options.max=Infinity] - Maximum allowed value
 * @param {boolean} [options.allowDecimals=true] - Whether to allow decimal values
 * @returns {number|null} Sanitized number or null if invalid
 * @example
 * sanitizeNumber('42') // 42
 * sanitizeNumber('3.14', { allowDecimals: false }) // null
 * sanitizeNumber('100', { min: 0, max: 50 }) // null
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
 * Sanitizes workout name by removing HTML, trimming, and enforcing max length.
 * NOTE: For live input during typing, use sanitizeText instead to preserve spaces.
 *
 * @param {string} name - The workout name to sanitize
 * @returns {string} Sanitized and trimmed workout name truncated to max length
 * @example
 * sanitizeWorkoutName('<b>Morning Run</b>') // 'Morning Run'
 * sanitizeWorkoutName('A'.repeat(300)) // Returns string with max 255 chars
 */
export const sanitizeWorkoutName = (name) => {
  const sanitized = sanitizeText(name).trim();
  return sanitized.slice(0, TEXT_LIMITS.WORKOUT_NAME_MAX);
};

/**
 * Sanitizes workout description by removing HTML, trimming, and enforcing max length.
 * NOTE: For live input during typing, use sanitizeText instead to preserve spaces.
 *
 * @param {string} description - The workout description to sanitize
 * @returns {string} Sanitized and trimmed description truncated to max length
 * @example
 * sanitizeDescription('Full body <script>bad</script>workout') // 'Full body workout'
 */
export const sanitizeDescription = (description) => {
  const sanitized = sanitizeText(description).trim();
  return sanitized.slice(0, TEXT_LIMITS.DESCRIPTION_MAX);
};

/**
 * Sanitizes exercise name by removing HTML, trimming, and enforcing max length.
 * NOTE: For live input during typing, use sanitizeText instead to preserve spaces.
 *
 * @param {string} name - The exercise name to sanitize
 * @returns {string} Sanitized and trimmed exercise name truncated to max length
 * @example
 * sanitizeExerciseName('Bench Press') // 'Bench Press'
 * sanitizeExerciseName('<i>Squats</i>') // 'Squats'
 */
export const sanitizeExerciseName = (name) => {
  const sanitized = sanitizeText(name).trim();
  return sanitized.slice(0, TEXT_LIMITS.EXERCISE_NAME_MAX);
};

/**
 * Sanitizes exercise values (sets, reps, weight) ensuring they're valid numbers.
 *
 * @param {string|number} value - The exercise value to sanitize
 * @returns {number|null} Sanitized numeric value or null if invalid
 * @example
 * sanitizeExerciseValue('10') // 10
 * sanitizeExerciseValue('75.5') // 75.5
 * sanitizeExerciseValue('abc') // null
 */
export const sanitizeExerciseValue = (value) => {
  return sanitizeNumber(value, {
    min: EXERCISE_LIMITS.WEIGHT_MIN,
    max: EXERCISE_LIMITS.WEIGHT_MAX,
    allowDecimals: true
  });
};

/**
 * Sanitizes date input ensuring it's valid and not in the future.
 *
 * @param {string} dateString - The date string to sanitize
 * @returns {string|null} Valid ISO date string (YYYY-MM-DD) or null if invalid
 * @example
 * sanitizeDate('2024-01-15') // '2024-01-15'
 * sanitizeDate('invalid') // null
 * sanitizeDate('2099-12-31') // null (future date)
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
 * Sanitizes AI-generated text to prevent script injection in AI responses.
 * Removes all HTML tags and control characters except newlines and tabs.
 *
 * @param {string} aiText - The raw text from AI response
 * @returns {string} Sanitized text safe for display and parsing
 * @example
 * sanitizeAIResponse('Exercise: Squats\n<script>bad</script>') // 'Exercise: Squats\n'
 * sanitizeAIResponse('Sets: 3\x00Reps: 10') // 'Sets: 3Reps: 10'
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
 * Validates and sanitizes email addresses using basic regex validation.
 *
 * @param {string} email - The email address to validate and sanitize
 * @returns {string|null} Lowercase sanitized email or null if invalid
 * @example
 * sanitizeEmail('USER@Example.COM') // 'user@example.com'
 * sanitizeEmail('invalid-email') // null
 * sanitizeEmail('<script>@test.com') // null
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;

  const sanitized = sanitizeText(email);

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) return null;

  return sanitized.toLowerCase();
};
