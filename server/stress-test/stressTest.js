import { sleep } from "k6";
import http from "k6/http";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";

export const options = {
  stages: [
    { duration: "1s", target: 100 },
  ],
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:palo alto": {
          loadZone: "amazon:us:palo alto",
          percent: 100,
        },
      },
    },
  },
  thresholds: { http_req_duration: ["p(90)<=10000"] },
};

let id = 10000000;


export default function main() {
  let response;

  let json = {
    id: id + __VU,
    title: faker.random.words(2),
    enrollments: faker.random.number(),
  }

  response = http.post(
    "http://localhost:3001/api/title/",
    JSON.stringify(json),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );

  // Automatically added sleep
  sleep(1);
}

