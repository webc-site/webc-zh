import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import { write } from "./util.js";
import { PKG_JSON } from "../const.js";

export default (dir, dest_com_dir) => {
  const pkg_path = join(dir, PKG_JSON),
    pkg = existsSync(pkg_path) ? JSON.parse(read(pkg_path)) : {},
    pkg_ver = pkg.name && pkg.version ? pkg.name + "@" + pkg.version : "";

  if (pkg_ver) {
    mkdirSync(dest_com_dir, { recursive: true });
    write(join(dest_com_dir, "ver.yml"), "npm: " + pkg_ver + "\n");
  }
};
