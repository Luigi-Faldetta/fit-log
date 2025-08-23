const { sequelize, DataTypes } = require('./db');

const Workout = sequelize.define('Workout', {
  workout_id: {
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
}, {
  tableName: 'Workouts',
  timestamps: true,
});

module.exports = {
  Workout,
};
