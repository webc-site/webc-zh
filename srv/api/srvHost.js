import { R_SRV_NAME_ID, R_SRV_HOST_ID } from "./R/SRV.js";
import { R_ID_HOST } from "./R/HOST.js";
import { SRV_NOT_FOUND } from "./ERR.js";
import binU64 from "@3-/intbin/binU64.js";
import int from "@3-/int";

export default async (redis, name) => {
  const srv_id_buf = await redis.getBuffer(R_SRV_NAME_ID(name));
  if (!srv_id_buf) {
    throw SRV_NOT_FOUND;
  }
  const srv_id = binU64(srv_id_buf),
    host_ids = await redis.zrange(R_SRV_HOST_ID(srv_id), 0, -1);
  if (host_ids.length === 0) {
    return [];
  }
  const domains = await redis.mget(host_ids.map(int).map(R_ID_HOST));
  return domains.filter(Boolean);
};
