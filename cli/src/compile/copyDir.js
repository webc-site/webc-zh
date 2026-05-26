import { existsSync, readdirSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { copy } from "./util.js";

export default (src, dest) => {
  if (!existsSync(src)) return;
  const stat = statSync(src);
  if (stat.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    readdirSync(src).forEach((entry) => {
      copyDir(join(src, entry), join(dest, entry));
    });
  } else {
    mkdirSync(dirname(dest), { recursive: true });
    copy(src, dest);
  }
};
