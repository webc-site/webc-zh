#!/usr/bin/env bun

import { dirname, join } from "node:path";
import read from "@3-/read";
import { globby } from "globby";
import { $ } from "@3-/zx";
import ROOT from "~/vite/const/ROOT.js";
import pkgMerge from "~/cli/src/pkgMerge.js";

$.verbose = 1;

const init = async () => {
  const files = await globby("**/package.json", {
      cwd: ROOT,
      ignore: ["**/node_modules/**", "**/dist/**", "package.json", "srv/workerd/**"],
    }),
    com_packages = [],
    other_dirs = [];

  for (const file of files) {
    const parts = file.split("/");
    if (parts[0] === "com") {
      com_packages.push(join(ROOT, file));
    } else {
      other_dirs.push(dirname(join(ROOT, file)));
    }
  }

  const all_com_deps = {};
  for (const pkg_path of com_packages) {
    const pkg = JSON.parse(read(pkg_path)),
      deps = pkg.dependencies || {};
    Object.assign(all_com_deps, deps);
  }

  await pkgMerge(all_com_deps, ROOT);

  await Promise.all(other_dirs.map((dir) => $(["cd " + dir + " && bun i"])));
};

export default init;

if (import.meta.main) {
  await init();
}
