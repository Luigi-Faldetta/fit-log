/**
 * Tests for validation middleware
 */

const { validationResult } = require('express-validator');
const {
  workoutValidators,
  exerciseValidators,
  weightValidators,
  bodyfatValidators,
  aiValidators,
  validate
} = require('../../middleware/validators');

// Mock express-validator
jest.mock('express-validator', () => ({
  body: jest.fn(() => ({
    trim: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    isISO8601: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    isFloat: jest.fn().mockReturnThis(),
    isArray: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
  })),
  param: jest.fn(() => ({
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
  })),
  validationResult: jest.fn(),
}));

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validate middleware', () => {
    it('should call next if no validation errors', () => {
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true)
      });

      validate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if validation errors exist', () => {
      const errors = [
        { path: 'name', msg: 'Name is required', value: '' },
        { path: 'age', msg: 'Age must be a number', value: 'abc' }
      ];

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(errors)
      });

      validate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: errors.map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('workoutValidators', () => {
    it('should have create validators', () => {
      expect(workoutValidators.create).toBeDefined();
      expect(Array.isArray(workoutValidators.create)).toBe(true);
    });

    it('should have update validators', () => {
      expect(workoutValidators.update).toBeDefined();
      expect(Array.isArray(workoutValidators.update)).toBe(true);
    });

    it('should have delete validators', () => {
      expect(workoutValidators.delete).toBeDefined();
      expect(Array.isArray(workoutValidators.delete)).toBe(true);
    });

    it('should have get validators', () => {
      expect(workoutValidators.get).toBeDefined();
      expect(Array.isArray(workoutValidators.get)).toBe(true);
    });
  });

  describe('exerciseValidators', () => {
    it('should have create validators', () => {
      expect(exerciseValidators.create).toBeDefined();
      expect(Array.isArray(exerciseValidators.create)).toBe(true);
    });

    it('should have update validators', () => {
      expect(exerciseValidators.update).toBeDefined();
      expect(Array.isArray(exerciseValidators.update)).toBe(true);
    });

    it('should have delete validators', () => {
      expect(exerciseValidators.delete).toBeDefined();
      expect(Array.isArray(exerciseValidators.delete)).toBe(true);
    });
  });

  describe('weightValidators', () => {
    it('should have create validators', () => {
      expect(weightValidators.create).toBeDefined();
      expect(Array.isArray(weightValidators.create)).toBe(true);
    });

    it('should have delete validators', () => {
      expect(weightValidators.delete).toBeDefined();
      expect(Array.isArray(weightValidators.delete)).toBe(true);
    });
  });

  describe('bodyfatValidators', () => {
    it('should have create validators', () => {
      expect(bodyfatValidators.create).toBeDefined();
      expect(Array.isArray(bodyfatValidators.create)).toBe(true);
    });

    it('should have delete validators', () => {
      expect(bodyfatValidators.delete).toBeDefined();
      expect(Array.isArray(bodyfatValidators.delete)).toBe(true);
    });
  });

  describe('aiValidators', () => {
    it('should have generateWorkout validators', () => {
      expect(aiValidators.generateWorkout).toBeDefined();
      expect(Array.isArray(aiValidators.generateWorkout)).toBe(true);
    });
  });
});
