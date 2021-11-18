const express = require('express');
const seq = require('../db/db.js');
const Review = require('../db/model/review.js')
const Characteristic = require('../db/model/characteristic.js')
const Characteristic_Review = require('../db/model/characteristic_reviews.js')
const Reviews_Photo = require('../db/model/reviews_photo.js')

const app = express();
app.use(express.json());
const PORT = 3000;


app.get('/', function (req, res) {
  res.send('Hello World')
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});