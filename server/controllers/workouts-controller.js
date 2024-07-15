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

exports.updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { name, description } = req.body;
    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    workout.name = name;
    workout.description = description;
    await workout.save();

    res.json(workout);
  } catch (error) {
    console.error('Failed to update workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
