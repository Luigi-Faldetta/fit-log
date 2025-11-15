/**
 * Validation Constants
 *
 * Centralized validation limits and constraints.
 * Shared between client and server to ensure consistency.
 */

// Text length limits
export const TEXT_LIMITS = {
  WORKOUT_NAME_MAX: 255,
  EXERCISE_NAME_MAX: 255,
  DESCRIPTION_MAX: 1000,
};

// Numeric limits for exercises
export const EXERCISE_LIMITS = {
  SETS_MIN: 1,
  SETS_MAX: 100,
  REPS_MIN: 1,
  REPS_MAX: 1000,
  WEIGHT_MIN: 0,
  WEIGHT_MAX: 10000,
};

// Body metrics limits
export const BODY_METRICS = {
  WEIGHT_MIN: 20,
  WEIGHT_MAX: 500,
  BODYFAT_MIN: 1,
  BODYFAT_MAX: 70,
};

// Age limits for AI workout generation
export const AGE_LIMITS = {
  MIN: 13,
  MAX: 120,
};

// Workout duration limits (in minutes)
export const DURATION_LIMITS = {
  MIN: 10,
  MAX: 180,
};

// Experience levels
export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];

// Rate limiting
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // Max requests per window
};

// AI Configuration
export const AI_CONFIG = {
  MODEL: 'gpt-4o-mini', // 60% cheaper than gpt-3.5-turbo, better performance
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  FREQUENCY_PENALTY: 0.3,
  PRESENCE_PENALTY: 0.3,
};

// HTTP Status Codes
export const HTTP_STATUS = {
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

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 30 * 60 * 1000,  // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};
