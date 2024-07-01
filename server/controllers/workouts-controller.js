const { Workout } = require('../models/workouts-model');

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll();
    res.json(workouts);
  } catch (error) {
    console.error('Failed to get events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newWorkout = await Workout.create({ name, description });
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Failed to create workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
