import ERR from "@3-/log/ERR.js";
import onReq from "./onReq.js";

/*
必须用 export default，绝对不能使用 export const fetch。
否则会导致 workerd 找不到入口进而 fallback 回环连接本机 9000 端口，最终引发 Too many open files 崩溃。
*/
export default {
  fetch: async (req, env, ctx) => {
    try {
      return await onReq(req, env, ctx);
    } catch (err) {
      ERR(req.url, err);
      return new Response("❌ " + (err.message || err), { status: 500 });
    }
  },
};
