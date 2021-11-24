const {getReviews, getMetadata, addReview, markReviewHelpful, reportReview} = require('../db/review_api.js');
const pactum = require('pactum');

describe('get reviews', () => {
  it('getReviews should be a function', () => {
    expect(typeof getReviews).toBe('function');
  });
})

it('should get reviews for product whose product id is 40344', async () => {
  await pactum.spec()
  .get('http://localhost:3000/reviews/meta?product_id=40344')
  .expectStatus(200);
})

it('should get review metadata for product whose product id is 40344', async () => {
  await pactum.spec()
  .get('http://localhost:3000/reviews/meta?product_id=40344')
  .expectStatus(200);
})

it('should save a new review', async () => {
  await pactum.spec()
  .post('http://localhost:3000/reviews')
  .withJson({
    "product_id": 8,
    "rating": 4,
    "summary": "SDC TEST",
    "body": "This is SDC TEST",
    "recommend": true,
    "name": "SDC_VF",
    "email": "sdc@sdc.com",
    "photos": ["http://placecorgi.com/250"],
    "characteristics": {"26":5}
  })
  .expectStatus(201);
})

it('should mark reivew whose review id is 1 helpful', async () => {
  await pactum.spec()
  .put('http://localhost:3000/reviews/1/helpful')
  .expectStatus(204);
})

it('should report a review whose review id is 1', async () => {
  await pactum.spec()
  .put('http://localhost:3000/reviews/1/report')
  .expectStatus(204);
})