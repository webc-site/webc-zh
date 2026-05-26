#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { join } from "node:path";
import { compareVersions } from "compare-versions";
import reqJson from "@3-/req/reqJson.js";
import CDN_PKG from "~/conf/web/npm/CDN_PKG.js";
import COM_PKG from "~/conf/web/npm/COM_PKG.js";
import ROOT from "~/vite/const/ROOT.js";

const parseVer = async (name) => {
    const ver_path = join(ROOT, "conf", "web", "ver", name + ".js");
    if (existsSync(ver_path)) {
      try {
        return (await import(ver_path)).default;
      } catch {}
    }
    return "0.1.0";
  },
  onlineVer = async (name) => {
    try {
      const data = await reqJson("https://registry.npmjs.org/" + name + "/latest", {
        signal: AbortSignal.timeout(3000),
      });
      return data.version || "0.0.0";
    } catch {}
    return "0.0.0";
  },
  bumpVersion = (version) => {
    const parts = version.split(".");
    parts[2] = String(parseInt(parts[2] || "0", 10) + 1);
    return parts.join(".");
  },
  main = async () => {
    const [v_cdn, v_com, o_cdn, o_com] = await Promise.all([
      parseVer(CDN_PKG),
      parseVer(COM_PKG),
      onlineVer(CDN_PKG),
      onlineVer(COM_PKG),
    ]);
    let max_v = v_cdn;
    if (compareVersions(v_com, max_v) > 0) {
      max_v = v_com;
    }
    if (compareVersions(o_cdn, max_v) > 0) {
      max_v = o_cdn;
    }
    if (compareVersions(o_com, max_v) > 0) {
      max_v = o_com;
    }
    console.log(bumpVersion(max_v));
  };

export default main;

if (import.meta.main) {
  await main();
}
