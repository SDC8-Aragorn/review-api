const Review = require('../db/model/review.js')
const Characteristic = require('../db/model/characteristic.js')
const Characteristic_Review = require('../db/model/characteristic_reviews.js')
const Reviews_Photo = require('../db/model/reviews_photo.js')
const Sequelize = require('sequelize');
const moment = require('moment');

/**
 * Get reviews and review photos from review db and return the full record
 * @param {*} query
 * @returns Reviews
 */
const getReviews = function(query) {
  var {product_id, page, count, sort} = query;
  var reveiwResponse = {
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

  var skip = (reveiwResponse.page -1) * reveiwResponse.count;

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
  // .then(async reviews => {

  //   for (var i = 0; i < reviews.length; i ++) {
  //     var review_id = reviews[i].review_id;
  //     let photos = await getReviewPhotos(review_id)
  //     reviews[i].dataValues.photos = photos;
  //   }
  //   obj['results'] = reviews;
  //   return obj;
  // })
  .then(reviews => {
    let promisedPhotoRecords = []
    for (var i = 0; i < reviews.length; i++) {
      reviews[i].date = moment(parseInt(reviews[i].date)).toISOString();
      var id = reviews[i].review_id;
      promisedPhotoRecords.push(Reviews_Photo.findAll({
        attributes: [
          'id',
          'url'
        ],
        where: {
          review_id: id
        }
      }));
    }
    return Promise.all(promisedPhotoRecords)
     .then(photos => {

       for (var j = 0; j < photos.length; j++) {
         reviews[j].dataValues.photos = photos[j];
       }
       reveiwResponse.results = reviews;

       return reveiwResponse;
     })
  })
}



const getReviewPhotos = function (id) {
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


const getMetadata = async function(query) {
  var {product_id} = query;
  var reviewMetaData = {
    product_id: product_id
  }

  let ratings = getRatings(product_id);
  let recommend =  getRecommend(product_id);
  let characteristics = getCharacteristic(product_id);

  let ratingValues = await Promise.all([ratings, recommend, characteristics]);
  const [ratingsList, recommendCount, characteristicsList] = ratingValues;

  var ratingMetaData = {};
  for (var i = 0; i < ratingsList.length; i ++) {
    var key = ratingsList[i].dataValues.rating;
    if (ratingMetaData[key] === undefined ) {
      ratingMetaData[key] = 1;
    } else {
      ratingMetaData[key] ++;
    }

  }

  var recommendMetaData = {};
  for (var j = 0; j < recommendCount.length; j ++) {
    var key = recommendCount[j].dataValues.recommend;
    if (recommendMetaData[key] === undefined) {
      recommendMetaData[key] = 1;

    } else {
      recommendMetaData[key] ++;
    }
  }

  var characteristicMetaData = {};
  for (var k = 0; k < characteristicsList.length; k ++) {
    var id = characteristicsList[k].dataValues.id;
    var name = characteristicsList[k].dataValues.name;
    var average = await getAverageChar(id);
    characteristicMetaData[name] = {id:id, value:average};

  }

  reviewMetaData.ratings = ratingMetaData;
  reviewMetaData.recommended = recommendMetaData;
  reviewMetaData.characteristics = characteristicMetaData;

  return reviewMetaData;
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
  let countPromise = Characteristic_Review.count({
    where: {
      characteristic_id: characteristic_id
    }
  });

  let sumPromise = Characteristic_Review.sum('value', {
    where: {
      characteristic_id: characteristic_id
    }
  })
  return Promise.all([countPromise, sumPromise])
  .then(results => {
    const [count, sum] = results;
    return sum/count;
  })
}

const addReview = async function (review) {
  var reviewToAdd = {
    product_id: review.product_id,
    rating: review.rating,
    date: Date.now(),
    summary: review.summary,
    body: review.body,
    recommend: review.recommend,
    reviewer_name: review.name,
    reviewer_email: review.email
  };

  return Review.create(reviewToAdd)
  .then(async result => {
    var promisedPhotoAndChar = [];
    var reviewId = result.review_id;


    if (review.photos) {
      for (var i = 0; i < review.photos.length; i ++) {
        promisedPhotoAndChar.push(Reviews_Photo.create({
          review_id: reviewId,
          url: review.photos[i]
        }))
      }
    }

    var characteristics = Object.keys(review.characteristics);
    //e.g.['14', '15']

    var values = Object.values(review.characteristics);
    //e.g.[5,5]

    for (var j = 0; j < characteristics.length; j ++) {
      promisedPhotoAndChar.push(Characteristic_Review.create({
        characteristic_id: parseInt(characteristics[j]),
        review_id: reviewId,
        value: values[j],

      }))

      // var characteristic_id = await Characteristic.findAll({
      //   attributes: [
      //     'id'
      //   ],
      //   where: {
      //     product_id: review.product_id,
      //     name: characteristics[j]
      //   }
      // })

      // console.log('characeriti_id is here', characteristic_id, characteristic_id[0].dataValues.id);

      // console.log('Values', j, values[j]);

      // promise.push(Characteristic_Review.create({
      //   id: characteristic_review_id + 1 + j,
      //   characteristic_id: characteristic_id[0].dataValues.id,
      //   review_id: reviewId,
      //   value: values[j],

      // }))

    }
    return Promise.all(promisedPhotoAndChar);
  })

}

const markReviewHelpful = function(review_id) {
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
  getMetadata,
  addReview,
  markReviewHelpful,
  reportReview
}