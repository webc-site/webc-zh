import { R_SRV_JS_PATH } from "./R/SRV.js";

export default async (redis, srv_id) => {
  return await redis.zrange(R_SRV_JS_PATH(srv_id), 0, -1);
};
