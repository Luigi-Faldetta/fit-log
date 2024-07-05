const { sequelize, DataTypes } = require('./db');
const { Workout } = require('./workouts-model');

const Exercise = sequelize.define('Exercise', {
  exercise_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  muscle_group: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rest: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  media_URL: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  workout_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Workouts',
      key: 'workout_id',
    },
    allowNull: false,
  },
});

module.exports = {
  Exercise,
};
