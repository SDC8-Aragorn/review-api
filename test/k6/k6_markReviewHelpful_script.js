import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 20,
  duration: '30s',

};
export default function () {
  let randomReviewId = Math.floor(Math.random() * 100000 + 900000);
  http.get(`http://localhost:3000/reviews/${randomReviewId}/helpful`);
  // sleep(1);
}



