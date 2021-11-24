const { Sequelize, Model, DataTypes } = require('sequelize');
const seq = require('../db.js');

class Review extends Model {}

Review.init({
  review_id: {
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
    allowNull:true
  },
  date: {
    type: DataTypes.BIGINT,
    allowNull:true

  },
  summary: {
    type: DataTypes.TEXT,
    allowNull:true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull:true

  },
  recommend: {
    type: DataTypes.BOOLEAN,
    allowNull:true


  },
  reported: {
    type: DataTypes.BOOLEAN,
    allowNull:true


  },
  reviewer_name: {
    type: DataTypes.TEXT,
    allowNull:true

  },
  reviewer_email: {
    type: DataTypes.TEXT,
    allowNull:true


  },
  response: {
    type: DataTypes.TEXT,
    allowNull:true

  },
  helpfulness: {
    type: DataTypes.INTEGER,
    allowNull:true

  }


}, {
  indexes: [
    {
      fields: ['product_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['recommend']
    },
    {
      fields: ['reported']
    },
    {
      fields: ['helpfulness']
    }
  ],
  sequelize: seq
});

module.exports = Review;