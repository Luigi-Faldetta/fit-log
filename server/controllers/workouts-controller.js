const { db } = require('../models/workouts-model');

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await db.workouts;
    res.json(workouts);
  } catch (error) {
    console.error('Failed to get events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
