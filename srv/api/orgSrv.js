import { R_ORG_SRV_ID } from "./R/ORG.js";
import { R_ID_SRV } from "./R/SRV.js";
import int from "@3-/int";

export default async (redis, org_id) => {
  const srv_ids = await redis.zrange(R_ORG_SRV_ID(org_id), 0, -1);
  if (srv_ids.length === 0) {
    return [];
  }
  const keys = srv_ids.map(int).map(R_ID_SRV),
    names = await redis.mget(keys),
    res = [];

  for (let i = 0; i < srv_ids.length; i = i + 1) {
    if (names[i]) {
      res.push([int(srv_ids[i]), names[i]]);
    }
  }
  return res;
};
