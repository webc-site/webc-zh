import { R_ORG_USER, R_USER_ORG } from "./R.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import sec from "@3-/time/sec.js";

export default async (redis, org_id, uid, role) => {
  const ts = sec();
  await redis
    .pipeline()
    .hset(R_ORG_USER(org_id), Buffer.from(u64Bin(uid)), Buffer.from(u64Bin(role)))
    .zadd(R_USER_ORG(uid), ts, org_id)
    .exec();
};
