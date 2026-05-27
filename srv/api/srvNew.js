import { R_SRV_ID } from "../src/R.js";
import { R_SRV_NAME_ID, R_SRV_ORG_ID, R_ID_SRV } from "./R/SRV.js";
import { R_ORG_SRV_ID } from "./R/ORG.js";
import { SRV_EXIST } from "./ERR.js";
import binU64 from "@3-/intbin/binU64.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import sec from "@3-/time/sec.js";

export default async (redis, org_id, name) => {
  const exist = await redis.getBuffer(R_SRV_NAME_ID(name));
  if (exist) {
    throw [SRV_EXIST, binU64(exist)];
  }

  const id = await redis.incr(R_SRV_ID),
    ts = sec();
  await redis
    .pipeline()
    .set(R_SRV_NAME_ID(name), Buffer.from(u64Bin(id)))
    .set(R_ID_SRV(id), name)
    .set(R_SRV_ORG_ID(id), org_id)
    .zadd(R_ORG_SRV_ID(org_id), ts, id)
    .exec();
  return id;
};
