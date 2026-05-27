import { R_SRV_ID, R_SRV_ID_INCR, R_SRV_USER } from "../src/R.js";
import { SRV_EXIST } from "./ERR.js";
import binU64 from "@3-/intbin/binU64.js";
import u64Bin from "@3-/intbin/u64Bin.js";

export default async (redis, uid, name) => {
  const exist = await redis.getBuffer(R_SRV_ID(name));
  if (exist) {
    throw [SRV_EXIST, binU64(exist)];
  }

  const id = await redis.incr(R_SRV_ID_INCR);
  await redis
    .pipeline()
    .set(R_SRV_ID(name), Buffer.from(u64Bin(id)))
    .set(R_SRV_USER(id), uid)
    .exec();
  return id;
};
