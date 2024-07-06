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

exports.createExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      muscle_group,
      weight,
      sets,
      reps,
      rest,
      media_URL,
      workout_id,
    } = req.body;
    const newExercise = await Exercise.create({
      name,
      description,
      muscle_group,
      weight,
      sets,
      reps,
      rest,
      media_URL,
      workout_id,
    });
    res.status(201).json(newExercise);
  } catch (error) {
    console.error('Failed to create exercise:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateExercises = async (req, res) => {
  try {
    const exercises = req.body;
    const updatedExercises = [];

    for (const exercise of exercises) {
      const updatedExercise = await Exercise.update(exercise, {
        where: { exercise_id: exercise.exercise_id },
      });
      updatedExercises.push(updatedExercise);
    }

    res.status(200).json(updatedExercises);
  } catch (error) {
    console.error('Failed to update exercises:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
