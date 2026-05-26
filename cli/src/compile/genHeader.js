import { existsSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";

export default (dir) => {
  const pkg_path = join(dir, "package.json"),
    pkg = existsSync(pkg_path) ? JSON.parse(read(pkg_path)) : {};
  return pkg.name && pkg.version
    ? "// " + pkg.name + "@" + pkg.version + (pkg.homepage ? " " + pkg.homepage : "") + "\n\n"
    : "";
};
