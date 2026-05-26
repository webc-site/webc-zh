import { existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

export default (dir) => {
  let curr = dir;
  while (true) {
    const pkg_path = join(curr, "package.json");
    if (existsSync(pkg_path)) {
      return pkg_path;
    }
    const parent = dirname(curr);
    if (parent === curr) {
      break;
    }
    curr = parent;
  }
  const pkg_path = join(dir, "package.json");
  writeFileSync(pkg_path, JSON.stringify({ type: "module" }, null, 2) + "\n");
  return pkg_path;
};
