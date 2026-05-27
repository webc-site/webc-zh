#!/usr/bin/env bun
import ver from "./init/workerd/ver.js";
import render from "./init/workerd/render.js";
import download from "./init/workerd/untar.js";
import { GITHUB_PREFIX } from "./init/workerd/env.js";

const latestTag = async () => {
    const res = await fetch(GITHUB_PREFIX + "latest", { redirect: "manual" }),
      location = res.headers.get("location");
    if (!location) throw new Error("获取最新版本标签失败");
    return location.substring(location.lastIndexOf("/") + 1);
  },
  main = async () => {
    const local_ver = ver(),
      tag = await latestTag(),
      local_ver_no_dash = local_ver ? local_ver.replace(/-/g, "") : null;

    let date = local_ver;
    if (!local_ver_no_dash || !tag.includes(local_ver_no_dash)) {
      date = await download(tag);
    } else {
      console.log("workerd 已是最新版: " + tag + "，跳过下载");
    }

    if (date) {
      render(date);
    }
  };

export default main;

if (import.meta.main) {
  await main();
}
