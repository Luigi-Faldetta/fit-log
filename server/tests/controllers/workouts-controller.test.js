/**
 * Tests for Workouts Controller
 */

const workoutController = require('../../controllers/workouts-controller');
const workoutService = require('../../services/workoutService');

// Mock the workout service
jest.mock('../../services/workoutService');

describe('Workouts Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getWorkouts', () => {
    it('should return all workouts', async () => {
      const mockWorkouts = [
        { id: 1, name: 'Morning Workout', description: 'Cardio' },
        { id: 2, name: 'Evening Workout', description: 'Strength' }
      ];

      workoutService.getAllWorkouts.mockResolvedValue(mockWorkouts);

      await workoutController.getWorkouts(req, res, next);

      expect(workoutService.getAllWorkouts).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockWorkouts);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      workoutService.getAllWorkouts.mockRejectedValue(error);

      await workoutController.getWorkouts(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getWorkout', () => {
    it('should return a single workout by ID', async () => {
      const mockWorkout = { id: 1, name: 'Morning Workout', description: 'Cardio' };
      req.params.workoutId = '1';

      workoutService.getWorkoutById.mockResolvedValue(mockWorkout);

      await workoutController.getWorkout(req, res, next);

      expect(workoutService.getWorkoutById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockWorkout);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle not found errors', async () => {
      req.params.workoutId = '999';
      const error = new Error('Workout not found');

      workoutService.getWorkoutById.mockRejectedValue(error);

      await workoutController.getWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('createWorkout', () => {
    it('should create a new workout', async () => {
      const newWorkout = { name: 'New Workout', description: 'Test workout' };
      const createdWorkout = { id: 1, ...newWorkout };

      req.body = newWorkout;
      workoutService.createWorkout.mockResolvedValue(createdWorkout);

      await workoutController.createWorkout(req, res, next);

      expect(workoutService.createWorkout).toHaveBeenCalledWith(newWorkout);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdWorkout);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      req.body = { name: '', description: 'Invalid' };
      const error = new Error('Validation error');

      workoutService.createWorkout.mockRejectedValue(error);

      await workoutController.createWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updateWorkout', () => {
    it('should update an existing workout', async () => {
      const updates = { name: 'Updated Workout', description: 'Updated description' };
      const updatedWorkout = { id: 1, ...updates };

      req.params.workoutId = '1';
      req.body = updates;
      workoutService.updateWorkout.mockResolvedValue(updatedWorkout);

      await workoutController.updateWorkout(req, res, next);

      expect(workoutService.updateWorkout).toHaveBeenCalledWith('1', updates);
      expect(res.json).toHaveBeenCalledWith(updatedWorkout);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle not found errors during update', async () => {
      req.params.workoutId = '999';
      req.body = { name: 'Updated' };
      const error = new Error('Workout not found');

      workoutService.updateWorkout.mockRejectedValue(error);

      await workoutController.updateWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteWorkout', () => {
    it('should delete a workout', async () => {
      req.params.workoutId = '1';
      workoutService.deleteWorkout.mockResolvedValue();

      await workoutController.deleteWorkout(req, res, next);

      expect(workoutService.deleteWorkout).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors during deletion', async () => {
      req.params.workoutId = '1';
      const error = new Error('Delete failed');

      workoutService.deleteWorkout.mockRejectedValue(error);

      await workoutController.deleteWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
