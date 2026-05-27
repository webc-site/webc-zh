import { R_SRV_ID, R_HOST, R_USER_HOST, R_SRV_HOST } from "../src/R.js";
import { SRV_NOT_FOUND } from "./ERR.js";
import binU64 from "@3-/intbin/binU64.js";
import sec from "@3-/time/sec.js";

export default async (redis, uid, domain, name) => {
  const srv_id_buf = await redis.getBuffer(R_SRV_ID(name));
  if (!srv_id_buf) {
    throw SRV_NOT_FOUND;
  }

  const srv_id = binU64(srv_id_buf),
    ts = sec();

  await redis
    .pipeline()
    .set(R_HOST(domain), srv_id_buf)
    .zadd(R_USER_HOST(uid), ts, domain)
    .zadd(R_SRV_HOST(srv_id), ts, domain)
    .exec();

  return srv_id;
};
