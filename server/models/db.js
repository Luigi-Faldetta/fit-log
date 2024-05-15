const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('workouts_db', '', 'admin', {
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
