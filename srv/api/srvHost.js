import { R_SRV_ID, R_SRV_HOST } from "../src/R.js";
import { SRV_NOT_FOUND } from "./ERR.js";
import binU64 from "@3-/intbin/binU64.js";

export default async (redis, name) => {
  const srv_id_buf = await redis.getBuffer(R_SRV_ID(name));
  if (!srv_id_buf) {
    throw SRV_NOT_FOUND;
  }
  const srv_id = binU64(srv_id_buf);
  return await redis.zrange(R_SRV_HOST(srv_id), 0, -1);
};
