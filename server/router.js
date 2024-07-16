const express = require('express');
const router = express.Router();
const workouts = require('./controllers/workouts-controller.js');
const exercises = require('./controllers/exercises-controller.js');

router.get('/workouts', workouts.getWorkouts);
router.get('/workouts/:workoutId', workouts.getWorkout); // New route to get a single workout by ID
router.post('/workouts', workouts.createWorkout);
router.delete('/workouts/:workoutId', workouts.deleteWorkout); // New route to delete a workout by ID
router.put('/workouts/:workoutId', workouts.updateWorkout);

router.get('/exercises', exercises.getExercises);
router.post('/exercises', exercises.createExercise);
router.put('/exercises', exercises.updateExercises);
router.delete('/exercises/:exerciseId', exercisesController.deleteExercise); // New route to delete an exercise by ID

module.exports = router;
