#!/usr/bin/env bun

import { join } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import CDN_PKG from "~/conf/npm/CDN_PKG.js";
import COM_PKG from "~/conf/npm/COM_PKG.js";
import ROOT from "~/vite/const/ROOT.js";

const parseVer = async (name) => (await import(join(ROOT, "conf", "ver", name + ".js"))).default,
  replaceVersion = (content, pkg, ver) => {
    const reg = new RegExp(
      pkg.replace(/\./g, "\\.") + "(?:@\\d+\\.\\d+\\.\\d+|/\\d+\\.\\d+\\.\\d+/)",
      "g",
    );
    return content.replace(reg, (match) =>
      match.includes("@") ? pkg + "@" + ver : pkg + "/" + ver + "/",
    );
  },
  main = async () => {
    const readme_path = join(ROOT, "README.md");
    let content = read(readme_path);
    for (const pkg of [CDN_PKG, COM_PKG]) {
      const ver = await parseVer(pkg);
      content = replaceVersion(content, pkg, ver);
    }
    write(readme_path, content);
    console.log("已更新 README.md 中的包版本号");
  };

export default main;

if (import.meta.main) {
  await main();
}
