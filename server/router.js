const express = require('express');
const router = express.Router();
const workouts = require('./controllers/workouts-controller.js');
const exercises = require('./controllers/exercises-controller.js');
const ai = require('./controllers/ai-controller.js');
const weight = require('./controllers/weight-controller.js');
const bodyfat = require('./controllers/bodyfat-controller.js');

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

router.get('/workouts', workouts.getWorkouts);
router.get('/workouts/:workoutId', workouts.getWorkout); // New route to get a single workout by ID
router.post('/workouts', workouts.createWorkout);
router.delete('/workouts/:workoutId', workouts.deleteWorkout); // New route to delete a workout by ID
router.put('/workouts/:workoutId', workouts.updateWorkout);

router.get('/exercises', exercises.getExercises);
router.post('/exercises', exercises.createExercise);
router.put('/exercises', exercises.updateExercises);
router.delete('/exercises/:exerciseId', exercises.deleteExercise); // New route to delete an exercise by ID

router.post('/ai/generate-workout', ai.generateAiWorkout); //New route to generate an AI workout

// New routes for weight and body fat
router.get('/weight', weight.getWeightData);
router.post('/weight', weight.createWeightEntry);
router.delete('/weight/:weightId', weight.deleteWeightEntry);

router.get('/bodyfat', bodyfat.getBodyFatData);
router.post('/bodyfat', bodyfat.createBodyFatEntry);
router.delete('/bodyfat/:bodyFatId', bodyfat.deleteBodyFatEntry);

module.exports = router;
