/**
 * Tests for validation constants
 */

const {
  TEXT_LIMITS,
  EXERCISE_LIMITS,
  BODY_METRICS,
  AGE_LIMITS,
  DURATION_LIMITS,
  EXPERIENCE_LEVELS,
  RATE_LIMITS,
  AI_CONFIG,
  HTTP_STATUS,
} = require('../../constants/validation');

describe('Validation Constants', () => {
  describe('TEXT_LIMITS', () => {
    it('should have correct workout name max length', () => {
      expect(TEXT_LIMITS.WORKOUT_NAME_MAX).toBe(255);
    });

    it('should have correct exercise name max length', () => {
      expect(TEXT_LIMITS.EXERCISE_NAME_MAX).toBe(255);
    });

    it('should have correct description max length', () => {
      expect(TEXT_LIMITS.DESCRIPTION_MAX).toBe(1000);
    });
  });

  describe('EXERCISE_LIMITS', () => {
    it('should have correct sets range', () => {
      expect(EXERCISE_LIMITS.SETS_MIN).toBe(1);
      expect(EXERCISE_LIMITS.SETS_MAX).toBe(100);
    });

    it('should have correct reps range', () => {
      expect(EXERCISE_LIMITS.REPS_MIN).toBe(1);
      expect(EXERCISE_LIMITS.REPS_MAX).toBe(1000);
    });

    it('should have correct weight range', () => {
      expect(EXERCISE_LIMITS.WEIGHT_MIN).toBe(0);
      expect(EXERCISE_LIMITS.WEIGHT_MAX).toBe(10000);
    });
  });

  describe('BODY_METRICS', () => {
    it('should have realistic weight range', () => {
      expect(BODY_METRICS.WEIGHT_MIN).toBe(20);
      expect(BODY_METRICS.WEIGHT_MAX).toBe(500);
    });

    it('should have realistic body fat range', () => {
      expect(BODY_METRICS.BODYFAT_MIN).toBe(1);
      expect(BODY_METRICS.BODYFAT_MAX).toBe(70);
    });
  });

  describe('AGE_LIMITS', () => {
    it('should have minimum age of 13', () => {
      expect(AGE_LIMITS.MIN).toBe(13);
    });

    it('should have maximum age of 120', () => {
      expect(AGE_LIMITS.MAX).toBe(120);
    });
  });

  describe('DURATION_LIMITS', () => {
    it('should have minimum duration of 10 minutes', () => {
      expect(DURATION_LIMITS.MIN).toBe(10);
    });

    it('should have maximum duration of 180 minutes', () => {
      expect(DURATION_LIMITS.MAX).toBe(180);
    });
  });

  describe('EXPERIENCE_LEVELS', () => {
    it('should include all valid experience levels', () => {
      expect(EXPERIENCE_LEVELS).toEqual(['beginner', 'intermediate', 'advanced']);
    });

    it('should be an array', () => {
      expect(Array.isArray(EXPERIENCE_LEVELS)).toBe(true);
    });

    it('should have exactly 3 levels', () => {
      expect(EXPERIENCE_LEVELS).toHaveLength(3);
    });
  });

  describe('RATE_LIMITS', () => {
    it('should have 15 minute window', () => {
      expect(RATE_LIMITS.WINDOW_MS).toBe(15 * 60 * 1000);
    });

    it('should allow 100 requests per window', () => {
      expect(RATE_LIMITS.MAX_REQUESTS).toBe(100);
    });
  });

  describe('AI_CONFIG', () => {
    it('should use gpt-3.5-turbo model', () => {
      expect(AI_CONFIG.MODEL).toBe('gpt-3.5-turbo');
    });

    it('should have reasonable token limit', () => {
      expect(AI_CONFIG.MAX_TOKENS).toBe(500);
    });

    it('should have temperature between 0 and 1', () => {
      expect(AI_CONFIG.TEMPERATURE).toBeGreaterThanOrEqual(0);
      expect(AI_CONFIG.TEMPERATURE).toBeLessThanOrEqual(1);
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have success status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
    });

    it('should have client error status codes', () => {
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
    });

    it('should have server error status codes', () => {
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
    });
  });
});
