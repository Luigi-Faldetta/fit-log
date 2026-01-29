/**
 * Workout Service
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for workout business logic
 * - Handles data access through models
 * - Handles business rules (e.g., cascade delete)
 * - No HTTP concerns (request/response)
 * - Throws errors for controllers to handle
 */

const { Workout } = require('../models/workouts-model');
const { Exercise } = require('../models/exercises-model');
const { AppError, NotFoundError, ValidationError } = require('../middleware/errorHandler');

class WorkoutService {
  /**
   * Get all workouts
   * @returns {Promise<Array>} - All workouts
   */
  async getAllWorkouts() {
    try {
      const workouts = await Workout.findAll({
        order: [['createdAt', 'DESC']]
      });
      return workouts;
    } catch (error) {
      console.error('Database error in getAllWorkouts:', error.message, error.original?.message || '');
      throw new AppError(`Failed to retrieve workouts: ${error.message}`, 500);
    }
  }

  /**
   * Get workout by ID
   * @param {number} workoutId - Workout ID
   * @returns {Promise<Object>} - Workout object
   * @throws {NotFoundError} - If workout not found
   */
  async getWorkoutById(workoutId) {
    if (!workoutId || isNaN(workoutId)) {
      throw new ValidationError('Invalid workout ID');
    }

    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    return workout;
  }

  /**
   * Get workout with exercises
   * @param {number} workoutId - Workout ID
   * @returns {Promise<Object>} - Workout with exercises
   * @throws {NotFoundError} - If workout not found
   */
  async getWorkoutWithExercises(workoutId) {
    if (!workoutId || isNaN(workoutId)) {
      throw new ValidationError('Invalid workout ID');
    }

    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    const exercises = await Exercise.findAll({
      where: { workout_id: workoutId },
      order: [['exercise_id', 'ASC']]
    });

    return {
      ...workout.toJSON(),
      exercises
    };
  }

  /**
   * Create new workout
   * @param {Object} workoutData - Workout data
   * @param {string} workoutData.name - Workout name
   * @param {string} workoutData.description - Workout description (optional)
   * @returns {Promise<Object>} - Created workout
   * @throws {ValidationError} - If data is invalid
   */
  async createWorkout(workoutData) {
    const { name, description } = workoutData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new ValidationError('Workout name is required');
    }

    try {
      const newWorkout = await Workout.create({
        name: name.trim(),
        description: description ? description.trim() : null
      });

      return newWorkout;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(error.message);
      }
      throw new AppError('Failed to create workout', 500);
    }
  }

  /**
   * Update workout
   * @param {number} workoutId - Workout ID
   * @param {Object} updateData - Data to update
   * @param {string} updateData.name - Workout name
   * @param {string} updateData.description - Workout description
   * @returns {Promise<Object>} - Updated workout
   * @throws {NotFoundError} - If workout not found
   * @throws {ValidationError} - If data is invalid
   */
  async updateWorkout(workoutId, updateData) {
    if (!workoutId || isNaN(workoutId)) {
      throw new ValidationError('Invalid workout ID');
    }

    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    const { name, description } = updateData;

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('Workout name cannot be empty');
      }
      workout.name = name.trim();
    }

    if (description !== undefined) {
      workout.description = description ? description.trim() : null;
    }

    try {
      await workout.save();
      return workout;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(error.message);
      }
      throw new AppError('Failed to update workout', 500);
    }
  }

  /**
   * Delete workout and associated exercises (cascade delete)
   * @param {number} workoutId - Workout ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} - If workout not found
   */
  async deleteWorkout(workoutId) {
    if (!workoutId || isNaN(workoutId)) {
      throw new ValidationError('Invalid workout ID');
    }

    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    try {
      // Business logic: Delete all associated exercises first (cascade delete)
      await Exercise.destroy({
        where: { workout_id: workoutId }
      });

      // Then delete the workout
      await workout.destroy();
    } catch (error) {
      throw new AppError('Failed to delete workout', 500);
    }
  }

  /**
   * Get exercises for a workout
   * @param {number} workoutId - Workout ID
   * @returns {Promise<Array>} - Exercises
   * @throws {NotFoundError} - If workout not found
   */
  async getWorkoutExercises(workoutId) {
    if (!workoutId || isNaN(workoutId)) {
      throw new ValidationError('Invalid workout ID');
    }

    // Verify workout exists
    const workout = await Workout.findByPk(workoutId);
    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    const exercises = await Exercise.findAll({
      where: { workout_id: workoutId },
      order: [['exercise_id', 'ASC']]
    });

    return exercises;
  }

  /**
   * Count total workouts
   * @returns {Promise<number>} - Total count
   */
  async countWorkouts() {
    try {
      const count = await Workout.count();
      return count;
    } catch (error) {
      throw new AppError('Failed to count workouts', 500);
    }
  }

  /**
   * Check if workout exists
   * @param {number} workoutId - Workout ID
   * @returns {Promise<boolean>} - True if exists
   */
  async workoutExists(workoutId) {
    if (!workoutId || isNaN(workoutId)) {
      return false;
    }

    const count = await Workout.count({
      where: { workout_id: workoutId }
    });

    return count > 0;
  }

  // ============= Exercise Methods =============

  /**
   * Get all exercises
   * @returns {Promise<Array>} - All exercises
   */
  async getAllExercises() {
    try {
      const exercises = await Exercise.findAll({
        order: [['exercise_id', 'ASC']]
      });
      return exercises;
    } catch (error) {
      throw new AppError('Failed to retrieve exercises', 500);
    }
  }

  /**
   * Get exercise by ID
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise<Object>} - Exercise object
   * @throws {NotFoundError} - If exercise not found
   */
  async getExerciseById(exerciseId) {
    if (!exerciseId || isNaN(exerciseId)) {
      throw new ValidationError('Invalid exercise ID');
    }

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    return exercise;
  }

  /**
   * Validate exercise data
   * @param {Object} exerciseData - Exercise data
   * @throws {ValidationError} - If data is invalid
   */
  validateExerciseData(exerciseData) {
    const { name, muscle_group, sets, reps, workout_id } = exerciseData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new ValidationError('Exercise name is required');
    }

    if (!muscle_group || typeof muscle_group !== 'string') {
      throw new ValidationError('Muscle group is required');
    }

    if (!sets || isNaN(sets) || sets < 1 || sets > 100) {
      throw new ValidationError('Sets must be between 1 and 100');
    }

    if (!reps || isNaN(reps) || reps < 1 || reps > 1000) {
      throw new ValidationError('Reps must be between 1 and 1000');
    }

    if (!workout_id || isNaN(workout_id)) {
      throw new ValidationError('Valid workout ID is required');
    }
  }

  /**
   * Create exercise
   * @param {Object} exerciseData - Exercise data
   * @returns {Promise<Object>} - Created exercise
   * @throws {ValidationError} - If data is invalid
   */
  async createExercise(exerciseData) {
    this.validateExerciseData(exerciseData);

    // Verify workout exists
    const workoutExists = await this.workoutExists(exerciseData.workout_id);
    if (!workoutExists) {
      throw new NotFoundError('Workout not found');
    }

    try {
      const newExercise = await Exercise.create({
        name: exerciseData.name.trim(),
        description: exerciseData.description ? exerciseData.description.trim() : null,
        muscle_group: exerciseData.muscle_group.trim(),
        weight: exerciseData.weight ? parseFloat(exerciseData.weight) : null,
        sets: parseInt(exerciseData.sets, 10),
        reps: parseInt(exerciseData.reps, 10),
        rest: exerciseData.rest ? parseInt(exerciseData.rest, 10) : null,
        media_URL: exerciseData.media_URL || null,
        workout_id: parseInt(exerciseData.workout_id, 10)
      });

      return newExercise;
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
        throw new ValidationError(error.message);
      }
      throw new AppError('Failed to create exercise', 500);
    }
  }

  /**
   * Update exercise
   * @param {number} exerciseId - Exercise ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated exercise
   * @throws {NotFoundError} - If exercise not found
   */
  async updateExercise(exerciseId, updateData) {
    if (!exerciseId || isNaN(exerciseId)) {
      throw new ValidationError('Invalid exercise ID');
    }

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    // Validate and update fields
    if (updateData.name !== undefined) {
      if (!updateData.name || typeof updateData.name !== 'string' || updateData.name.trim().length === 0) {
        throw new ValidationError('Exercise name cannot be empty');
      }
      exercise.name = updateData.name.trim();
    }

    if (updateData.description !== undefined) {
      exercise.description = updateData.description ? updateData.description.trim() : null;
    }

    if (updateData.muscle_group !== undefined) {
      if (!updateData.muscle_group) {
        throw new ValidationError('Muscle group is required');
      }
      exercise.muscle_group = updateData.muscle_group.trim();
    }

    if (updateData.weight !== undefined) {
      exercise.weight = updateData.weight ? parseFloat(updateData.weight) : null;
    }

    if (updateData.sets !== undefined) {
      const sets = parseInt(updateData.sets, 10);
      if (isNaN(sets) || sets < 1 || sets > 100) {
        throw new ValidationError('Sets must be between 1 and 100');
      }
      exercise.sets = sets;
    }

    if (updateData.reps !== undefined) {
      const reps = parseInt(updateData.reps, 10);
      if (isNaN(reps) || reps < 1 || reps > 1000) {
        throw new ValidationError('Reps must be between 1 and 1000');
      }
      exercise.reps = reps;
    }

    if (updateData.rest !== undefined) {
      exercise.rest = updateData.rest ? parseInt(updateData.rest, 10) : null;
    }

    if (updateData.media_URL !== undefined) {
      exercise.media_URL = updateData.media_URL || null;
    }

    try {
      await exercise.save();
      return exercise;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(error.message);
      }
      throw new AppError('Failed to update exercise', 500);
    }
  }

  /**
   * Bulk update exercises (creates new ones if they don't exist)
   * @param {Array<Object>} exercises - Array of exercise objects with IDs
   * @returns {Promise<Array>} - Updated/created exercises
   */
  async bulkUpdateExercises(exercises) {
    if (!Array.isArray(exercises) || exercises.length === 0) {
      throw new ValidationError('Exercises array is required');
    }

    const updatedExercises = [];

    for (const exerciseData of exercises) {
      if (!exerciseData.exercise_id) {
        throw new ValidationError('Each exercise must have an exercise_id');
      }

      // Check if exercise exists in database
      const existingExercise = await Exercise.findByPk(exerciseData.exercise_id);

      if (existingExercise) {
        // Update existing exercise
        const updated = await this.updateExercise(exerciseData.exercise_id, exerciseData);
        updatedExercises.push(updated);
      } else {
        // Create new exercise (it has a client-generated temporary ID)
        try {
          const newExercise = await Exercise.create({
            name: exerciseData.name?.trim() || 'New Exercise',
            description: exerciseData.description ? exerciseData.description.trim() : null,
            muscle_group: exerciseData.muscle_group?.trim() || 'other',
            weight: exerciseData.weight ? parseFloat(exerciseData.weight) : null,
            sets: parseInt(exerciseData.sets, 10) || 1,
            reps: parseInt(exerciseData.reps, 10) || 1,
            rest: exerciseData.rest ? parseInt(exerciseData.rest, 10) : null,
            media_URL: exerciseData.media_URL || null,
            workout_id: parseInt(exerciseData.workout_id, 10)
          });
          updatedExercises.push(newExercise);
        } catch (error) {
          console.error('Failed to create exercise:', error.message);
          throw new AppError(`Failed to create exercise: ${error.message}`, 500);
        }
      }
    }

    return updatedExercises;
  }

  /**
   * Delete exercise
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} - If exercise not found
   */
  async deleteExercise(exerciseId) {
    if (!exerciseId || isNaN(exerciseId)) {
      throw new ValidationError('Invalid exercise ID');
    }

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    try {
      await exercise.destroy();
    } catch (error) {
      throw new AppError('Failed to delete exercise', 500);
    }
  }
}

// Export singleton instance
module.exports = new WorkoutService();
