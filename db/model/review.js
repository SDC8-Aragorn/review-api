const { Sequelize, Model, DataTypes } = require('sequelize');
const seq = require('../db.js');

class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,

  },
  date: {
    type: DataTypes.BIGINT,

  },
  summary: {
    type: DataTypes.TEXT,
  },
  body: {
    type: DataTypes.TEXT,

  },
  recommend: {
    type: DataTypes.BOOLEAN,


  },
  reported: {
    type: DataTypes.BOOLEAN,


  },
  reviewer_name: {
    type: DataTypes.TEXT,

  },
  reviewer_email: {
    type: DataTypes.TEXT,


  },
  response: {
    type: DataTypes.TEXT,
  },
  helpfulness: {
    type: DataTypes.INTEGER,

  }


}, {
  sequelize: seq
});

module.exports = Review;