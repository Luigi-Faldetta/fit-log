const express = require('express');
const router = express.Router();
const workouts = require('./controllers/workouts-controller.js');
const exercises = require('./controllers/exercises-controller.js');
const ai = require('./controllers/ai-controller.js');
const weight = require('./controllers/weight-controller.js');
const bodyfat = require('./controllers/bodyfat-controller.js');

// Middleware
const { clerkAuth, requireAuthentication } = require('./middleware/auth.js');
const {
  workoutValidators,
  exerciseValidators,
  weightValidators,
  bodyfatValidators,
  aiValidators
} = require('./middleware/validators.js');
const { requireDatabase, asyncHandler } = require('./middleware/errorHandler.js');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Server is running' 
  });
});

// Test endpoint that doesn't require database
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Workout routes - all require authentication and database
router.get('/workouts',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  asyncHandler(workouts.getWorkouts)
);

router.get('/workouts/:workoutId',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  workoutValidators.getById,
  asyncHandler(workouts.getWorkout)
);

router.post('/workouts',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  workoutValidators.create,
  asyncHandler(workouts.createWorkout)
);

router.put('/workouts/:workoutId',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  workoutValidators.update,
  asyncHandler(workouts.updateWorkout)
);

router.delete('/workouts/:workoutId',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  workoutValidators.delete,
  asyncHandler(workouts.deleteWorkout)
);

// Exercise routes - all require authentication and database
router.get('/exercises',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  asyncHandler(exercises.getExercises)
);

router.post('/exercises',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  exerciseValidators.create,
  asyncHandler(exercises.createExercise)
);

router.put('/exercises',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  exerciseValidators.update,
  asyncHandler(exercises.updateExercises)
);

router.delete('/exercises/:exerciseId',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  exerciseValidators.delete,
  asyncHandler(exercises.deleteExercise)
);

// AI routes - require authentication and database
router.post('/ai/generate-workout',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  aiValidators.generateWorkout,
  asyncHandler(ai.generateAiWorkout)
);

// Weight routes - all require authentication and database
router.get('/weight',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  asyncHandler(weight.getWeightData)
);

router.post('/weight',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  weightValidators.create,
  asyncHandler(weight.createWeightEntry)
);

router.delete('/weight/:weightId',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  weightValidators.delete,
  asyncHandler(weight.deleteWeightEntry)
);

// Body fat routes - all require authentication and database
router.get('/bodyfat',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  asyncHandler(bodyfat.getBodyFatData)
);

router.post('/bodyfat',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  bodyfatValidators.create,
  asyncHandler(bodyfat.createBodyFatEntry)
);

router.delete('/bodyfat/:bodyFatId',
  clerkAuth,
  requireAuthentication,
  requireDatabase,
  bodyfatValidators.delete,
  asyncHandler(bodyfat.deleteBodyFatEntry)
);

module.exports = router;
