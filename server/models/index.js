const { sequelize } = require('../db');
const { Workout } = require('./workouts-model');
const { Exercise } = require('./exercises-model');

// Define associations
Workout.hasMany(Exercise, {
  foreignKey: 'workout_id',
  onDelete: 'CASCADE',
});

Exercise.belongsTo(Workout, {
  foreignKey: 'workout_id',
  onDelete: 'CASCADE',
});

// Sync all models
sequelize.sync({ alter: true });

module.exports = {
  Workout,
  Exercise,
  sequelize,
};
