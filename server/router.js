const express = require('express');
const router = express.Router();
const workouts = require('./controllers/workouts-controller.js');
const exercises = require('./controllers/exercises-controller.js');

router.get('/workouts', workouts.getWorkouts);
router.post('/workouts', workouts.createWorkout);
router.get('/exercises', exercises.getExercises);
router.post('/exercises', exercises.createExercise);

module.exports = router;
