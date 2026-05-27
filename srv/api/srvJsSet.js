import { R_JS } from "../src/R.js";
import { R_SRV_JS_PATH } from "./R/SRV.js";
import { pack } from "msgpackr";
import { COMPATIBILITY_DATE as FLAG_COMPATIBILITY_DATE } from "../src/const/WORKER/FLAG.js";
import COMPATIBILITY_DATE from "../conf/workerd/compatibilityDate.js";
import sec from "@3-/time/sec.js";

export default async (redis, srv_id, path, code, compatibility_date, ex) => {
  const val = pack([code, [FLAG_COMPATIBILITY_DATE, compatibility_date || COMPATIBILITY_DATE]]),
    ts = sec(),
    pipeline = redis.pipeline();

  if (ex) {
    pipeline.setex(R_JS(srv_id, path), ex, val);
  } else {
    pipeline.set(R_JS(srv_id, path), val);
  }

  await pipeline.zadd(R_SRV_JS_PATH(srv_id), ts, path).exec();
};
