const { Exercise } = require('../models/exercises-model');

exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    console.error('Failed to get exercises:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
