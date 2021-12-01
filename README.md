# review-api
************

## Tech Stack

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)



## ETL (extract, transform, load) process
*****************************************
- create schemas for tables (reviews, reviews_photos, characteristics and characteristic_reviews)
- import review data collected to Postgres using COPY statement


## Test
*******

### Functionality

- Write API functionality test suite using Pactum

### Stress test

- Test API performance using K6




## Performance Improvement
*************************

### Database


 - Create indexes on columns that are frequently searched against
 - Avereage response time drop from 25s to hundreds of ms

### Server


 - Make parallel db calls to benefit from asynchronous programming
 - Average response time drop from hundreds of ms to under 50 ms

