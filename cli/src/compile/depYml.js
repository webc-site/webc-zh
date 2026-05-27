import { existsSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";
import { copy } from "./util.js";
import { LIB } from "../const/DIR.js";
import verYml from "./verYml.js";
import { PKG_JSON } from "../const.js";

export default (dir, canonical_name, processed_files) => {
  const dep_components = new Set();
  processed_files.forEach((file_path) => {
    const rel = relative(dir, file_path);
    if (rel && !rel.startsWith("..")) {
      const parts = rel.split("/");
      if (parts.length > 1) {
        const dep_name = parts[0];
        if (dep_name && dep_name[0] === dep_name[0].toUpperCase()) {
          dep_components.add(dep_name);
        }
      }
    }
  });

  dep_components.add(canonical_name);

  dep_components.forEach((dep_name) => {
    const dest_com_path = join(LIB, dep_name);
    verYml(dir, dest_com_path);

    const src_pkg = join(dir, dep_name, PKG_JSON);
    if (existsSync(src_pkg)) {
      mkdirSync(dest_com_path, { recursive: true });
      copy(src_pkg, join(dest_com_path, PKG_JSON));
    }
  });

  return dep_components;
};
