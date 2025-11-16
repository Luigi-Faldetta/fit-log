const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Workout Validators
 */
const workoutValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Workout name is required')
      .isLength({ min: 1, max: 255 }).withMessage('Workout name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('date')
      .optional()
      .isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    validate
  ],

  update: [
    param('workoutId').isInt().withMessage('Workout ID must be a valid integer'),
    body('name')
      .optional()
      .trim()
      .notEmpty().withMessage('Workout name cannot be empty')
      .isLength({ min: 1, max: 255 }).withMessage('Workout name must be between 1 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('date')
      .optional()
      .isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    validate
  ],

  delete: [
    param('workoutId').isInt().withMessage('Workout ID must be a valid integer'),
    validate
  ],

  get: [
    param('workoutId').isInt().withMessage('Workout ID must be a valid integer'),
    validate
  ]
};

/**
 * Exercise Validators
 */
const exerciseValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Exercise name is required')
      .isLength({ min: 1, max: 255 }).withMessage('Exercise name must be between 1 and 255 characters'),
    body('sets')
      .optional()
      .isInt({ min: 0, max: 100 }).withMessage('Sets must be between 0 and 100'),
    body('reps')
      .optional()
      .isInt({ min: 0, max: 1000 }).withMessage('Reps must be between 0 and 1000'),
    body('weight')
      .optional()
      .isFloat({ min: 0, max: 10000 }).withMessage('Weight must be between 0 and 10000'),
    body('duration')
      .optional()
      .isInt({ min: 0, max: 86400 }).withMessage('Duration must be between 0 and 86400 seconds'),
    body('workout_id')
      .optional()
      .isInt().withMessage('Workout ID must be a valid integer'),
    validate
  ],

  update: [
    body('exercises')
      .isArray({ min: 1 }).withMessage('Exercises must be a non-empty array'),
    body('exercises.*.exercise_id')
      .isInt().withMessage('Exercise ID must be a valid integer'),
    body('exercises.*.name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 }).withMessage('Exercise name must be between 1 and 255 characters'),
    body('exercises.*.sets')
      .optional()
      .isInt({ min: 0, max: 100 }).withMessage('Sets must be between 0 and 100'),
    body('exercises.*.reps')
      .optional()
      .isInt({ min: 0, max: 1000 }).withMessage('Reps must be between 0 and 1000'),
    body('exercises.*.weight')
      .optional()
      .isFloat({ min: 0, max: 10000 }).withMessage('Weight must be between 0 and 10000'),
    validate
  ],

  delete: [
    param('exerciseId').isInt().withMessage('Exercise ID must be a valid integer'),
    validate
  ]
};

/**
 * Weight Validators
 */
const weightValidators = {
  create: [
    body('date')
      .isISO8601().withMessage('Date must be a valid ISO 8601 date')
      .notEmpty().withMessage('Date is required'),
    body('value')
      .isFloat({ min: 0, max: 1000 }).withMessage('Weight must be between 0 and 1000')
      .notEmpty().withMessage('Weight value is required'),
    validate
  ],

  delete: [
    param('weightId').isInt().withMessage('Weight entry ID must be a valid integer'),
    validate
  ]
};

/**
 * Body Fat Validators
 */
const bodyfatValidators = {
  create: [
    body('date')
      .isISO8601().withMessage('Date must be a valid ISO 8601 date')
      .notEmpty().withMessage('Date is required'),
    body('value')
      .isFloat({ min: 0, max: 100 }).withMessage('Body fat percentage must be between 0 and 100')
      .notEmpty().withMessage('Body fat value is required'),
    validate
  ],

  delete: [
    param('bodyFatId').isInt().withMessage('Body fat entry ID must be a valid integer'),
    validate
  ]
};

/**
 * AI Workout Validators
 */
const aiValidators = {
  generateWorkout: [
    body('age')
      .isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('experienceLevel')
      .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Experience level must be beginner, intermediate, or advanced'),
    body('goal')
      .trim()
      .notEmpty().withMessage('Goal is required')
      .isLength({ max: 500 }).withMessage('Goal cannot exceed 500 characters'),
    body('duration')
      .isInt({ min: 5, max: 300 }).withMessage('Duration must be between 5 and 300 minutes'),
    body('request')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Request cannot exceed 1000 characters'),
    validate
  ]
};

module.exports = {
  workoutValidators,
  exerciseValidators,
  weightValidators,
  bodyfatValidators,
  aiValidators,
  validate
};
