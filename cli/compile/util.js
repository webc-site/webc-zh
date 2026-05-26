import { writeFileSync, copyFileSync } from "node:fs";
import { relative } from "node:path";
import { ROOT } from "../const/DIR.js";
import GRAY from "@3-/log/GRAY.js";

export const logRel = (file_path) => GRAY(relative(ROOT, file_path)),
  write = (file_path, content) => {
    writeFileSync(file_path, content);
    logRel(file_path);
  },
  copy = (src, dest) => {
    copyFileSync(src, dest);
    logRel(dest);
  },
  toUnixRel = (from, to) => relative(from, to).replaceAll("\\", "/"),
  findXDeps = (content) => [...content.matchAll(/(['"])(x\/[^'"]+)\1/g)].map((m) => m[2].slice(2));
