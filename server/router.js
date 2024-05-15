const express = require('express');
const router = express.Router();
const workouts = require('./controllers/workouts-controller.js');

router.get('/workouts', workouts.getWorkouts);
// router.post('/workouts', workouts.postWorkout);

module.exports = router;
