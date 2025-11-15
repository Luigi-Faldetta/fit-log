/**
 * Exercises Controller
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for HTTP request/response handling
 * - Delegates business logic to workoutService
 * - No database access
 * - No business logic
 */

const workoutService = require('../services/workoutService');

/**
 * Get all exercises
 * @route GET /api/exercises
 */
exports.getExercises = async (req, res, next) => {
  try {
    const exercises = await workoutService.getAllExercises();
    res.json(exercises);
  } catch (error) {
    next(error);
  }
};

/**
 * Create exercise
 * @route POST /api/exercises
 */
exports.createExercise = async (req, res, next) => {
  try {
    const {
      name,
      description,
      muscle_group,
      weight,
      sets,
      reps,
      rest,
      media_URL,
      workout_id,
    } = req.body;

    const newExercise = await workoutService.createExercise({
      name,
      description,
      muscle_group,
      weight,
      sets,
      reps,
      rest,
      media_URL,
      workout_id,
    });

    res.status(201).json(newExercise);
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk update exercises
 * @route PUT /api/exercises
 */
exports.updateExercises = async (req, res, next) => {
  try {
    const exercises = req.body;
    const updatedExercises = await workoutService.bulkUpdateExercises(exercises);
    res.status(200).json(updatedExercises);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete exercise
 * @route DELETE /api/exercises/:exerciseId
 */
exports.deleteExercise = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    await workoutService.deleteExercise(exerciseId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
