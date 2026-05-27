import R from "./R.js";
import ERR from "@3-/log/ERR.js";

const fetch = async (req, env, ctx) => {
  const { hostname, pathname } = new URL(req.url),
    key = hostname + pathname;

  try {
    const worker = env.loader.get(key, async () => {
      const val = await R.get("worker:" + key);
      if (!val) {
        throw new Error("未找到 " + key + " 的配置");
      }
      const data = JSON.parse(val);
      if (!data || !data.code) {
        throw new Error(key + " 的 Worker 代码为空或无效");
      }
      const { code, compatibilityDate } = data;
      return {
        compatibilityDate: compatibilityDate || "2026-05-01",
        mainModule: "index.js",
        modules: {
          "index.js": code,
        },
      };
    });

    const entry = worker.getEntrypoint();
    return await entry.fetch(req, env, ctx);
  } catch (err) {
    ERR("路由 " + key, err.message || err);
    return new Response("[代理错误] " + err.message, { status: 500 });
  }
};

export default { fetch };
