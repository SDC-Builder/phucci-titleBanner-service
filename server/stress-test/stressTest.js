import { sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "12s", target: 10 },
    { duration: "36s", target: 10 },
    { duration: "12s", target: 0 },
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
  thresholds: { http_req_duration: ["p(90)<=2000"] },
};

export default function main() {
  let response;

  response = http.get("http://localhost:3001/api/tittle/9999999");

  // Automatically added sleep
  sleep(1);
}
