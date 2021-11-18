const { Sequelize, Model, DataTypes } = require('sequelize');
const seq = require('../db.js');

class Reviews_Photo extends Model {}

Reviews_Photo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model:"Reviews",
      key: 'id'
    },
  },
  url: {
    type: DataTypes.TEXT,
  },

}, {
  sequelize: seq
});

module.exports = Reviews_Photo;