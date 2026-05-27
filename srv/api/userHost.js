import { R_USER_HOST } from "../src/R.js";

export default async (redis, uid) => {
  return await redis.zrange(R_USER_HOST(uid), 0, -1);
};
