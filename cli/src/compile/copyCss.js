import { existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { copy } from "./util.js";
import { CSS } from "../const/DIR.js";

export default (dir) => {
  const package_styl_dir = join(dir, "styl");
  if (existsSync(package_styl_dir)) {
    readdirSync(package_styl_dir).forEach((entry) => {
      const src_path = join(package_styl_dir, entry),
        dest_path = join(CSS, entry);
      if (entry.endsWith(".css")) {
        mkdirSync(dirname(dest_path), { recursive: true });
        copy(src_path, dest_path);
      }
    });
  }
};
