const { sequelize, DataTypes } = require('./db');

const BodyFat = sequelize.define('BodyFat', {
  bodyfat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = {
  BodyFat,
};
