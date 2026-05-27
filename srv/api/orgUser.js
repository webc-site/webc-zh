import { R_ORG_USER } from "./R.js";
import binU64 from "@3-/intbin/binU64.js";

export default async (redis, org_id) => {
  const key = R_ORG_USER(org_id),
    res = [];
  let cursor = "0";

  do {
    const [next, kv] = await redis.hscanBuffer(key, cursor, "COUNT", 1000);
    cursor = next.toString();
    for (let i = 0; i < kv.length; i = i + 2) {
      res.push([binU64(kv[i]), binU64(kv[i + 1])]);
    }
  } while (cursor !== "0");

  return res;
};
