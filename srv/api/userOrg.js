import { R_USER_ORG } from "./R.js";
import int from "@3-/int";

export default async (redis, uid) => {
  const org_ids = await redis.zrange(R_USER_ORG(uid), 0, -1);
  return org_ids.map(int);
};
