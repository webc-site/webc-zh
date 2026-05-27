import R from "./conn/R.js";
import { R_JS, R_HOST } from "./R.js";
import { unpack } from "msgpackr";
import binU64 from "@3-/intbin/binU64.js";
import { COMPATIBILITY_DATE as FLAG_COMPATIBILITY_DATE } from "./const/WORKER/FLAG.js";
import COMPATIBILITY_DATE from "../conf/workerd/compatibilityDate.js";
import LIMITS from "../conf/workerd/limits.js";
import { NO_HOST, NO_CONF, BAD_WORKER } from "./const/ERR.js";

const I_JS = "i.js";

export default async (req, env, ctx) => {
  const { pathname, hostname } = new URL(req.url),
    path = pathname.slice(1),
    srv_id_buf = await R.getBuffer(R_HOST(hostname));
  if (!srv_id_buf) {
    throw NO_HOST;
  }
  const srv_id = binU64(srv_id_buf),
    worker = env.loader.get(pathname, async () => {
      const val = await R.getBuffer(R_JS(srv_id, path));
      if (!val) {
        throw NO_CONF;
      }
      const data = unpack(val);
      if (!Array.isArray(data) || !data[0]) {
        throw BAD_WORKER;
      }
      const [code, ...configs] = data,
        map = new Map(configs);
      return {
        compatibilityDate: map.get(FLAG_COMPATIBILITY_DATE) || COMPATIBILITY_DATE,
        limits: LIMITS,
        mainModule: I_JS,
        modules: {
          [I_JS]: code,
        },
      };
    });

  return await worker.getEntrypoint().fetch(req, env, ctx);
};
