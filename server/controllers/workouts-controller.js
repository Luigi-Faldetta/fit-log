const { Workout } = require('../models/workouts-model');
const { Exercise } = require('../models/exercises-model');

exports.getWorkouts = async (req, res) => {
  try {
    console.log('=== WORKOUTS ENDPOINT CALLED ===');
    console.log('Time:', new Date().toISOString());
    
    // Test database connection first
    const { sequelize } = require('../models/db');
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection verified');
    
    console.log('Attempting to query Workout model...');
    const workouts = await Workout.findAll();
    console.log('✓ Query successful. Found workouts:', workouts.length);
    console.log('Workouts data:', JSON.stringify(workouts, null, 2));
    
    res.json(workouts);
  } catch (error) {
    console.error('❌ WORKOUTS ENDPOINT ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      name: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Failed to get workout:', error);
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

exports.deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workout = await Workout.findByPk(workoutId);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Delete all exercises associated with the workout
    await Exercise.destroy({ where: { workout_id: workoutId } });

    await workout.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
