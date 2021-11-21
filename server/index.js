const express = require('express');
const seq = require('../db/db.js');
const Review = require('../db/model/review.js')
const Characteristic = require('../db/model/characteristic.js')
const Characteristic_Review = require('../db/model/characteristic_reviews.js')
const Reviews_Photo = require('../db/model/reviews_photo.js')
const db = require('../db/review_api.js')

const app = express();
app.use(express.json());
const PORT = 3000;


app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/reviews', function (req, res) {
  console.log('GET /reviews working');
  // console.log(req.query);
  db.getReviews(req.query)
  .then(results => {
    console.log('API', results);
    res.json(results);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })

})

app.get('/reviews/meta', (req, res)=> {
  console.log('GET /review/meta working');
  db.getMeta(req.query)
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
})

app.post('/reviews', (req, res)=> {
  console.log('POST /reviews working', req.body);
  db.addReview(req.body)
  .then(results => {
    res.sendStatus(201);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
})

//PUT /reviews/:review_id/helpful is working
app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log('PUT /reviews/:review_id/helpful working');
  db.upVote(req.params.review_id)
  .then(results => {
    res.sendStatus(204);
  })
  .catch(err => {
    res.status(500).send(err)
  })
})

//PUT /reviews/:review_id/report is working
app.put('/reviews/:review_id/report', (req, res) => {
  console.log('PUT /reviews/:review_id/report working');
  db.reportReview(req.params.review_id)
  .then(results => {
    res.sendStatus(204);
  })
  .catch(err => {
    res.status(500).send(err);
  })
})




app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});