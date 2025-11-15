/**
 * Validation Constants
 *
 * Centralized validation limits and constraints for server-side.
 * Shared constants with client to ensure consistency.
 */

// Text length limits
const TEXT_LIMITS = {
  WORKOUT_NAME_MAX: 255,
  EXERCISE_NAME_MAX: 255,
  DESCRIPTION_MAX: 1000,
};

// Numeric limits for exercises
const EXERCISE_LIMITS = {
  SETS_MIN: 1,
  SETS_MAX: 100,
  REPS_MIN: 1,
  REPS_MAX: 1000,
  WEIGHT_MIN: 0,
  WEIGHT_MAX: 10000,
};

// Body metrics limits
const BODY_METRICS = {
  WEIGHT_MIN: 20,
  WEIGHT_MAX: 500,
  BODYFAT_MIN: 1,
  BODYFAT_MAX: 70,
};

// Age limits for AI workout generation
const AGE_LIMITS = {
  MIN: 13,
  MAX: 120,
};

// Workout duration limits (in minutes)
const DURATION_LIMITS = {
  MIN: 10,
  MAX: 180,
};

// Experience levels
const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];

// Rate limiting
const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // Max requests per window
};

// AI Configuration
const AI_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  FREQUENCY_PENALTY: 0.3,
  PRESENCE_PENALTY: 0.3,
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

module.exports = {
  TEXT_LIMITS,
  EXERCISE_LIMITS,
  BODY_METRICS,
  AGE_LIMITS,
  DURATION_LIMITS,
  EXPERIENCE_LEVELS,
  RATE_LIMITS,
  AI_CONFIG,
  HTTP_STATUS,
};
