import { R_ID_SRV } from "./R/SRV.js";
import { SRV_NOT_FOUND } from "./ERR.js";

export default async (redis, srv_id) => {
  const name = await redis.get(R_ID_SRV(srv_id));
  if (!name) {
    throw SRV_NOT_FOUND;
  }
  return name;
};
