import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { $ } from "@3-/zx";
import read from "@3-/read";
import pkgFind from "./pkgFind.js";

export default async (src_deps, start_dir) => {
  if (!src_deps || Object.keys(src_deps).length === 0) {
    return false;
  }
  const pkg_path = pkgFind(start_dir),
    pkg = JSON.parse(read(pkg_path));

  pkg.dependencies = pkg.dependencies || {};
  let changed = false;

  for (const [name, ver] of Object.entries(src_deps)) {
    if (pkg.dependencies[name] !== ver) {
      pkg.dependencies[name] = ver;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(pkg_path, JSON.stringify(pkg, null, 2) + "\n");
    await $(["cd " + dirname(pkg_path) + " && ni"]);
  }
  return changed;
};
