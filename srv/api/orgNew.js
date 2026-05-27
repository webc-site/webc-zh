import { R_ID_BY_ORG, R_ORG, R_ORG_USER, R_ORG_ID, R_USER_ORG } from "./R/ORG.js";
import { ORG_EXIST } from "./ERR.js";
import { OWNER } from "./const/ORG_USER_ROLE.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import sec from "@3-/time/sec.js";

export default async (redis, user_id, org_name) => {
  const exist = await redis.get(R_ID_BY_ORG(org_name));
  if (exist) {
    throw [ORG_EXIST, Number(exist)];
  }

  const id = await redis.incr(R_ORG_ID),
    ts = sec();

  await redis
    .pipeline()
    .set(R_ID_BY_ORG(org_name), id)
    .set(R_ORG(id), org_name)
    .hset(R_ORG_USER(id), Buffer.from(u64Bin(user_id)), Buffer.from(u64Bin(OWNER)))
    .zadd(R_USER_ORG(user_id), ts, id)
    .exec();

  return id;
};
