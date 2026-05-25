#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { join } from "node:path";
import CDN_PKG from "~/conf/npm/CDN_PKG.js";
import COM_PKG from "~/conf/npm/COM_PKG.js";
import ROOT from "~/vite/const/ROOT.js";

const parseVer = async (name) => {
    const ver_path = join(ROOT, "conf", "ver", name + ".js");
    for (const file_path of [join(ROOT, ".cache", name + ".js"), ver_path]) {
      if (existsSync(file_path)) {
        try {
          return (await import(file_path)).default;
        } catch {}
      }
    }
    return "0.1.0";
  },
  bumpVersion = (version) => {
    const parts = version.split(".");
    parts[2] = String(parseInt(parts[2] || "0", 10) + 1);
    return parts.join(".");
  },
  compareVersions = (v1, v2) => {
    const p1 = v1.split(".").map(Number),
      p2 = v2.split(".").map(Number);
    for (let i = 0; i < 3; ++i) {
      if (p1[i] != p2[i]) {
        return p1[i] > p2[i] ? 1 : -1;
      }
    }
    return 0;
  },
  main = async () => {
    const v_cdn = await parseVer(CDN_PKG),
      v_com = await parseVer(COM_PKG),
      max_v = compareVersions(v_cdn, v_com) >= 0 ? v_cdn : v_com;
    console.log(bumpVersion(max_v));
  };

export default main;

if (import.meta.main) {
  await main();
}
