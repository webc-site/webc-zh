import Redis from "ioredis";
import ERR from "@3-/log/ERR.js";
import WARN from "@3-/log/WARN.js";
import CONF from "../conf/R.js";

let CONN;

const conn = (conf) => {
  let c = new Redis({
    enableAutoPipelining: true,
    retryStrategy: (times) => Math.min(times * 500, 5000),
    reconnectOnError: (err) =>
      err.message.includes("READONLY") ? (WARN("Redis READONLY", err.message), 2) : false,
    ...conf,
  });

  c.on("error", (err) => {
    ERR("Redis", err.message);
  });
  return c;
};

export default new Proxy(
  {},
  {
    get(target, prop) {
      if (!CONN) {
        CONN = conn(CONF);
      }
      return CONN[prop].bind(CONN);
    },
  },
);
