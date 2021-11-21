const Review = require('../db/model/review.js')
const Characteristic = require('../db/model/characteristic.js')
const Characteristic_Review = require('../db/model/characteristic_reviews.js')
const Reviews_Photo = require('../db/model/reviews_photo.js')
const Sequelize = require('sequelize');

const getReviews = function(query) {
  // console.log("getReviews", query)
  var {product_id, page, count, sort} = query;
  var obj = {
    product: product_id,
    page: page || 1,
    count: count || 5
  }

  var filter = [];
  if (sort === 'helpful') {
    filter = [['helpfulness', 'DESC']];
  } else if (sort === 'relevant') {
    filter = [['rating', 'DESC']];
  } else if (sort === 'newest') {
    filter =[['date', 'DESC']]
  }

  var skip = (obj.page -1) * obj.count;

  return Review.findAll({
    attributes: [
      'review_id',
      'rating',
      'summary',
      'recommend',
      'response',
      'body',
      'date',
      'reviewer_name',
      'helpfulness'
    ],
    where: {
      product_id: product_id
    },
    order: filter,
    offset: skip,
    limit: count
  })
  .then(async reviews => {

    for (var i = 0; i < reviews.length; i ++) {
      var id = reviews[i].review_id;
      let photos = await getReviewPhotos(id)
      reviews[i].dataValues.photos = photos;
    }
    obj['results'] = reviews;
    if (obj.response === 'null') {
      obj.response = null;
    }
    return obj;
  })
  // .then(reviews => {
  //   var promises = [];
  //   for (var i = 0; i < reviews.length; i ++) {
  //     var id = reviews[i].review_id;
  //     promises.push(Reviews_Photo.findAll({
  //       attributes: [
  //         'id',
  //         'url'
  //       ],
  //       where: {
  //         review_id: id
  //       }
  //     }));
  //   }
  //   Promise.all(promises)
  //   .then(photos => {

  //     for (var j = 0; j < photos.length; j ++) {
  //       reviews[j].dataValues.photos = photos[j];
  //     }
  //     obj.results = reviews;
  //     console.log(obj.results);
  //     return obj
  //   })
  // })
}

const getReviewPhotos = function (id){
  return Reviews_Photo.findAll({
    attributes: [
      'id',
      'url'
    ],
    where: {
      review_id: id
    }
  })
}


const getMeta = async function(query) {
  var {product_id} = query;
  var obj = {
    product_id: product_id
  }

  var ratings = await getRatings(product_id);
  // console.log(ratings);
  var ratingObj = {};
  for (var i = 0; i < ratings.length; i ++) {
    var key = ratings[i].dataValues.rating;
    if (ratingObj[key] === undefined ) {
      ratingObj[key] = 1;
    } else {
      ratingObj[key] ++;
    }

  }

  var recommend = await getRecommend(product_id);
  // console.log(recommend);
  var recommendObj = {};
  for (var j = 0; j < recommend.length; j ++) {
    var key = recommend[j].dataValues.recommend;
    if (recommendObj[key] === undefined) {
      recommendObj[key] = 1;

    } else {
      recommendObj[key] ++;
    }
  }

  var characteristics = await getCharacteristic(product_id);
  // console.log(characteristics);
  var characteristicObj = {};
  for (var k = 0; k < characteristics.length; k ++) {
    var id = characteristics[k].dataValues.id;
    var name = characteristics[k].dataValues.name;
    var average = await getAverageChar(id);
    // console.log(name, id, average);
    characteristicObj[name] = {id:id, value:average};

  }

  obj.ratings = ratingObj;
  obj.recommended = recommendObj;
  obj.characteristics = characteristicObj;

  return obj;
}

const getRatings = function(product_id) {
  return Review.findAll({
    attributes: [
      'rating'
    ],
    where: {
      product_id: product_id,
    }
  })

}

const getRecommend = function(product_id) {
  return Review.findAll({
    attributes: [
      'recommend'
    ],
    where: {
      product_id: product_id,
    }
  })

}

const getCharacteristic = function(product_id) {
  return Characteristic.findAll({
    attributes: [
      'id',
      'name'
    ],
    where: {
      product_id: product_id
    }
  })
}

const getAverageChar = async function (characteristic_id) {
  var count = await Characteristic_Review.count({
    where: {
      characteristic_id: characteristic_id
    }
  });

  var sum = await Characteristic_Review.sum('value', {
    where: {
      characteristic_id: characteristic_id
    }
  })

  return sum/count;

}

const addReview = async function (review) {
  var obj = {
    product_id: review.product_id,
    rating: review.rating,
    date: Date.now(),
    summary: review.summary,
    body: review.body,
    recommend: review.recommend,
    reviewer_name: review.name,
    reviewer_email: review.email
  };

  var review_id = await Review.max('review_id')
  // console.log('look at here',review_id);
  obj.review_id = review_id + 1;
  // console.log('object', obj);

  var photo_id = await Reviews_Photo.max('id');

  var characteristic_review_id = await Characteristic_Review.max('id');

  return Review.create(obj)
  .then(async result => {
    // console.log('LOOK HERE',result)
    var promise = [];
    var reviewId = result.review_id;


    if (review.photos) {
      for (var i = 0; i < review.photos.length; i ++) {
        promise.push(Reviews_Photo.create({
          id: photo_id + 1 + i,
          review_id: reviewId,
          url: review.photos[i]
        }))
      }
    }

    var characteristics = Object.keys(review.characteristics);
    //e.g.['Size', 'Fit']
    console.log('Characteriscts', characteristics)

    var values = Object.values(review.characteristics);
    //e.g.[4,5]
    console.log('Values', values);

    for (var j = 0; j < characteristics.length; j ++) {

      var characteristic_id = await Characteristic.findAll({
        attributes: [
          'id'
        ],
        where: {
          product_id: review.product_id,
          name: characteristics[j]
        }
      })

      console.log('characeriti_id is here', characteristic_id, characteristic_id[0].dataValues.id);

      console.log('Values', j, values[j]);

      promise.push(Characteristic_Review.create({
        id: characteristic_review_id + 1 + j,
        characteristic_id: characteristic_id[0].dataValues.id,
        review_id: reviewId,
        value: values[j],

      }))

    }
    return Promise.all(promise);
  })

}

const upVote = function(review_id) {
  return Review.increment('helpfulness', {
    where: {review_id: review_id}
  })

}

const reportReview = function(review_id) {
  return Review.update({reported: true}, {
    where: {review_id: review_id}
  })
}

module.exports = {
  getReviews,
  getMeta,
  addReview,
  upVote,
  reportReview
}