import Redis from "ioredis";
import ERR from "@3-/log/ERR.js";
import WARN from "@3-/log/WARN.js";
import CONF from "../conf/R.js";

const R = new Redis({
  // workerd 限制：禁止在模块评估阶段建立 TCP 连接，须启用 lazyConnect
  lazyConnect: true,
  enableAutoPipelining: true,
  enableOfflineQueue: true,
  maxRetriesPerRequest: 3,
  connectTimeout: 3000,
  retryStrategy: (times) => Math.min(times * 500, 5000),
  reconnectOnError: (err) =>
    err.message.includes("READONLY") ? (WARN("Redis READONLY", err.message), 2) : false,
  ...CONF,
});

R.on("error", (err) => {
  ERR("Redis", err.message);
});

export default R;
