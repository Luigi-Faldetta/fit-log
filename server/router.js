const express = require('express');
const router = express.Router();
const workouts = require('./controllers/workouts-controller.js');
const exercises = require('./controllers/exercises-controller.js');
const ai = require('./controllers/ai-controller.js');
const weight = require('./controllers/weight-controller.js');
const bodyfat = require('./controllers/bodyfat-controller.js');

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
