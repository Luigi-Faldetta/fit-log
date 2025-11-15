import { describe, it, expect, vi } from 'vitest';
import {
  sanitizeHTML,
  sanitizeText,
  sanitizeNumber,
  sanitizeWorkoutName,
  sanitizeExerciseName,
  sanitizeDescription,
} from '../../utils/sanitize';

// Mock DOMPurify more specifically for these tests
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((dirty, config) => {
      // Simple mock: if ALLOWED_TAGS is empty, strip all HTML
      if (config?.ALLOWED_TAGS?.length === 0) {
        return dirty.replace(/<[^>]*>/g, '');
      }
      return dirty;
    }),
  },
}));

describe('sanitize utilities', () => {
  describe('sanitize HTML', () => {
    it('should strip HTML tags from input', () => {
      const result = sanitizeHTML('<script>alert("xss")</script>Hello');
      expect(result).toBe('Hello');
    });

    it('should return empty string for null input', () => {
      const result = sanitizeHTML(null);
      expect(result).toBe('');
    });

    it('should return empty string for non-string input', () => {
      const result = sanitizeHTML(123);
      expect(result).toBe('');
    });

    it('should strip bold tags', () => {
      const result = sanitizeHTML('<b>Bold text</b>');
      expect(result).toBe('Bold text');
    });
  });

  describe('sanitizeText', () => {
    it('should trim and sanitize text', () => {
      const result = sanitizeText('  Normal Text  ');
      expect(result).toBe('Normal Text');
    });

    it('should strip HTML from text', () => {
      const result = sanitizeText('<p>Paragraph</p>');
      expect(result).toBe('Paragraph');
    });

    it('should return empty string for empty input', () => {
      const result = sanitizeText('');
      expect(result).toBe('');
    });

    it('should handle complex HTML', () => {
      const result = sanitizeText('<div><span>Text</span></div>');
      expect(result).toBe('Text');
    });
  });

  describe('sanitizeWorkoutName', () => {
    it('should trim and sanitize workout name', () => {
      const result = sanitizeWorkoutName('  Morning Workout  ');
      expect(result).toBe('Morning Workout');
    });

    it('should strip HTML from workout name', () => {
      const result = sanitizeWorkoutName('<b>Workout</b>');
      expect(result).toBe('Workout');
    });

    it('should return empty string for empty input', () => {
      const result = sanitizeWorkoutName('');
      expect(result).toBe('');
    });

    it('should truncate to max length', () => {
      const longName = 'a'.repeat(300);
      const result = sanitizeWorkoutName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('sanitizeExerciseName', () => {
    it('should trim and sanitize exercise name', () => {
      const result = sanitizeExerciseName('  Bench Press  ');
      expect(result).toBe('Bench Press');
    });

    it('should strip HTML from exercise name', () => {
      const result = sanitizeExerciseName('<i>Exercise</i>');
      expect(result).toBe('Exercise');
    });

    it('should truncate to max length', () => {
      const longName = 'a'.repeat(300);
      const result = sanitizeExerciseName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('sanitizeDescription', () => {
    it('should trim and sanitize description', () => {
      const result = sanitizeDescription('  Description text  ');
      expect(result).toBe('Description text');
    });

    it('should handle empty description', () => {
      const result = sanitizeDescription('');
      expect(result).toBe('');
    });

    it('should truncate to max length', () => {
      const longDesc = 'a'.repeat(1500);
      const result = sanitizeDescription(longDesc);
      expect(result.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('sanitizeNumber', () => {
    it('should parse valid number', () => {
      const result = sanitizeNumber('42');
      expect(result).toBe(42);
    });

    it('should handle decimal numbers', () => {
      const result = sanitizeNumber('3.14');
      expect(result).toBe(3.14);
    });

    it('should return null for NaN', () => {
      const result = sanitizeNumber('abc');
      expect(result).toBeNull();
    });

    it('should return null for null', () => {
      const result = sanitizeNumber(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined', () => {
      const result = sanitizeNumber(undefined);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = sanitizeNumber('');
      expect(result).toBeNull();
    });

    it('should handle negative numbers', () => {
      const result = sanitizeNumber('-10');
      expect(result).toBe(-10);
    });

    it('should respect min constraint', () => {
      const result = sanitizeNumber('5', { min: 10 });
      expect(result).toBeNull();
    });

    it('should respect max constraint', () => {
      const result = sanitizeNumber('100', { max: 50 });
      expect(result).toBeNull();
    });

    it('should respect allowDecimals=false', () => {
      const result = sanitizeNumber('3.14', { allowDecimals: false });
      expect(result).toBe(3);
    });

    it('should allow numbers within range', () => {
      const result = sanitizeNumber('25', { min: 0, max: 100 });
      expect(result).toBe(25);
    });
  });
});
