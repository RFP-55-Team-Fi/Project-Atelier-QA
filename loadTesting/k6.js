import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get(`http://50.18.20.51/qa/questions/?product_id=${Math.floor(Math.random() * (800000 - 1) + 1)}`);
  sleep(1);
}

