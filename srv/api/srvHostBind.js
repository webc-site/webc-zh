import { R_HOST_SRV } from "../src/R.js";
import {
  R_SRV_NAME_ID,
  R_ORG_HOST_ID,
  R_SRV_HOST_ID,
  R_HOST_ID,
  R_ID_BY_HOST,
  R_ID_HOST,
} from "./R.js";
import { SRV_NOT_FOUND } from "./ERR.js";
import binU64 from "@3-/intbin/binU64.js";
import sec from "@3-/time/sec.js";

export default async (redis, org_id, domain, name) => {
  const srv_id_buf = await redis.getBuffer(R_SRV_NAME_ID(name));
  if (!srv_id_buf) {
    throw SRV_NOT_FOUND;
  }

  const srv_id = binU64(srv_id_buf),
    ts = sec();

  let host_id = await redis.get(R_ID_BY_HOST(domain));
  if (!host_id) {
    host_id = await redis.incr(R_HOST_ID);
  }

  await redis
    .pipeline()
    .set(R_HOST_SRV(domain), srv_id_buf)
    .set(R_ID_BY_HOST(domain), host_id)
    .set(R_ID_HOST(host_id), domain)
    .zadd(R_ORG_HOST_ID(org_id), ts, host_id)
    .zadd(R_SRV_HOST_ID(srv_id), ts, host_id)
    .exec();

  return srv_id;
};
