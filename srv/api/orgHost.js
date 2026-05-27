import { R_ORG_HOST_ID, R_ID_HOST } from "./R.js";
import int from "@3-/int";

export default async (redis, org_id) => {
  const host_ids = await redis.zrange(R_ORG_HOST_ID(org_id), 0, -1);
  if (host_ids.length === 0) {
    return [];
  }
  const domains = await redis.mget(host_ids.map(int).map(R_ID_HOST));
  return domains.filter(Boolean);
};
