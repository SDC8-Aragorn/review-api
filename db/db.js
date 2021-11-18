const { Sequelize, Model, DataTypes } = require ('sequelize');
const{ user, database, password } = require ('../config/config.js');

//connect to a database
const seq = new Sequelize(database, user, password, {
  host: '/tmp',
  dialect:'postgres',
  define: {
    timestamps: false
  }
});

//use .authenticate() to test the connection
seq.authenticate()
.then(() => seq.sync())
.catch((error) => console.log(error));


module.exports = seq;

// seq.authenticate()
// .then(() => seq.sync({force:true}))
// .catch((error) => console.log(error));