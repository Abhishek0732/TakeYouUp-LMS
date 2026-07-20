// import http from "k6/http";
// import { sleep } from "k6";

// export const options = {
//   vus: 650, // virtual users
//   duration: "30s", // test duration
// };

// export default function () {
//   http.get("http://127.0.0.1:8081/");
//   sleep(1);
// }

import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  scenarios: {
    stress_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 2000 }, // warm up
        { duration: "1m", target: 1000 },
        { duration: "1m", target: 2000 },
        { duration: "1m", target: 4000 },
        { duration: "1m", target: 8000 },
        { duration: "1m", target: 12000 }, // push system
        { duration: "1m", target: 0 }, // ramp down
      ],
    },
  },

  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95% requests < 1s
    http_req_failed: ["rate<0.05"], // <5% failures
  },
};

export default function () {
  const res = http.get("https://demo.unopim.com/");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
