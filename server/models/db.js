const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('workouts_db', 'postgres', 'ffjjkl', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    noPrimaryKey: true,
  },
  logging: false,
});

module.exports = {
  sequelize,
  DataTypes,
};
