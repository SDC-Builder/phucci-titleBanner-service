import { sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "0.10s", target: 100, rps: 1000 },
    { duration: "0.10s", target: 200, rps: 1000 },
    { duration: "0.10s", target: 300, rps: 1000 },

    { duration: "0.10s", target: 400, rps: 1000 },
    { duration: "0.10s", target: 500, rps: 1000 },
    { duration: "0.10s", target: 600, rps: 1000 },

    { duration: "0.10s", target: 700, rps: 1000 },
    { duration: "0.10s", target: 800, rps: 1000 },
    { duration: "0.10s", target: 900, rps: 1000 },
    { duration: "0.10s", target: 1000, rps: 1000 },
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

let id = 9000000;

export default function main() {
  let response;

  response = http.get(`http://localhost:3001/api/title/${id + __VU}`);

  // Automatically added sleep
  sleep(1);
}

