const { Sequelize } = require ('sequelize');
const{ user, database, password } = require ('../config/config.js');

//connect to a database
const seq = new Sequelize(database, user, password, {
  host: 'ec2-3-131-141-188.us-east-2.compute.amazonaws.com',
  port: 5432,
  dialect:'postgres',
  define: {
    timestamps: false
  },
  logging: false
});

//use .authenticate() to test the connection
seq.authenticate()
.then(() => console.log('connected'))
.catch((error) => console.log(error));

//drop and build tables using schema
// seq.authenticate()
// .then(() => seq.sync({force:true}))
// .catch((error) => console.log(error));

module.exports = seq;
