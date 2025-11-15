/**
 * Workouts Controller
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for HTTP request/response handling
 * - Delegates business logic to workoutService
 * - No database access
 * - No business logic
 */

const workoutService = require('../services/workoutService');

/**
 * Get all workouts
 * @route GET /api/workouts
 */
exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await workoutService.getAllWorkouts();
    res.json(workouts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single workout by ID
 * @route GET /api/workouts/:workoutId
 */
exports.getWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    const workout = await workoutService.getWorkoutById(workoutId);
    res.json(workout);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new workout
 * @route POST /api/workouts
 */
exports.createWorkout = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newWorkout = await workoutService.createWorkout({ name, description });
    res.status(201).json(newWorkout);
  } catch (error) {
    next(error);
  }
};

/**
 * Update workout
 * @route PUT /api/workouts/:workoutId
 */
exports.updateWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    const { name, description } = req.body;
    const updatedWorkout = await workoutService.updateWorkout(workoutId, { name, description });
    res.json(updatedWorkout);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete workout
 * @route DELETE /api/workouts/:workoutId
 */
exports.deleteWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    await workoutService.deleteWorkout(workoutId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
