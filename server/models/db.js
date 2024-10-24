const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'workouts_db',
  'postgres',
  'ffjjkl',
  {
    host: process.env.DATABASE_URL ? undefined : 'localhost',
    dialect: 'postgres',
    define: {
      noPrimaryKey: true,
    },
    logging: false,
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === 'production'
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
  }
);

module.exports = {
  sequelize,
  DataTypes,
};
