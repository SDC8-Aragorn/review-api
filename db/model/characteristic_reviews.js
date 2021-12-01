const { Sequelize, Model, DataTypes } = require('sequelize');
const seq = require('../db.js');

class Characteristic_Review extends Model {}

Characteristic_Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  characteristic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model:"Characteristics",
      key: 'id'
    },
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model:"Reviews",
      key: 'review_id'
    },
  },
  value: {
    type: DataTypes.INTEGER,
  },

}, {
  indexes: [
    {
      fields: ['characteristic_id']
    },
    {
      fields: ['review_id']
    }
  ],
  sequelize: seq
});

module.exports = Characteristic_Review;