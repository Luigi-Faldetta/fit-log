import { describe, it, expect } from 'vitest';
import {
  validateWorkoutName,
  validateExerciseName,
  validateSets,
  validateReps,
  validateWeight,
  validateDescription,
  validateDate,
} from '../../utils/validation';

describe('validation utilities', () => {
  describe('validateWorkoutName', () => {
    it('should validate a correct workout name', () => {
      const result = validateWorkoutName('Morning Cardio');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject empty workout name', () => {
      const result = validateWorkoutName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Workout name is required');
    });

    it('should reject workout name that is too long', () => {
      const longName = 'a'.repeat(256);
      const result = validateWorkoutName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be 255 characters or less');
    });

    it('should trim whitespace before validation', () => {
      const result = validateWorkoutName('  Valid Name  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject only whitespace', () => {
      const result = validateWorkoutName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Workout name cannot be empty');
    });
  });

  describe('validateExerciseName', () => {
    it('should validate a correct exercise name', () => {
      const result = validateExerciseName('Bench Press');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject empty exercise name', () => {
      const result = validateExerciseName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Exercise name is required');
    });

    it('should reject exercise name that is too long', () => {
      const longName = 'a'.repeat(256);
      const result = validateExerciseName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be 255 characters or less');
    });
  });

  describe('validateSets', () => {
    it('should validate correct number of sets', () => {
      const result = validateSets(3);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject sets below minimum', () => {
      const result = validateSets(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Sets must be at least 1');
    });

    it('should reject sets above maximum', () => {
      const result = validateSets(101);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Sets must be 100 or less');
    });

    it('should handle string input', () => {
      const result = validateSets('5');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject non-numeric input', () => {
      const result = validateSets('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Sets must be a number');
    });
  });

  describe('validateReps', () => {
    it('should validate correct number of reps', () => {
      const result = validateReps(10);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject reps below minimum', () => {
      const result = validateReps(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Reps must be at least 1');
    });

    it('should reject reps above maximum', () => {
      const result = validateReps(1001);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Reps must be 1000 or less');
    });
  });

  describe('validateWeight', () => {
    it('should validate correct weight', () => {
      const result = validateWeight(100);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept zero weight', () => {
      const result = validateWeight(0);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject negative weight', () => {
      const result = validateWeight(-10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be negative');
    });

    it('should reject weight above maximum', () => {
      const result = validateWeight(10001);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Weight must be 10000 or less');
    });

    it('should handle decimal weights', () => {
      const result = validateWeight(75.5);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateDescription', () => {
    it('should validate correct description', () => {
      const result = validateDescription('This is a valid description');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept empty description', () => {
      const result = validateDescription('');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject description that is too long', () => {
      const longDesc = 'a'.repeat(1001);
      const result = validateDescription(longDesc);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description must be 1000 characters or less');
    });
  });

  describe('validateDate', () => {
    it('should validate a correct date', () => {
      const result = validateDate('2024-01-15');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject empty date', () => {
      const result = validateDate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date is required');
    });

    it('should reject invalid date format', () => {
      const result = validateDate('invalid-date');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid date format');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateDate(futureDate.toISOString());
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Date cannot be in the future');
    });
  });
});
