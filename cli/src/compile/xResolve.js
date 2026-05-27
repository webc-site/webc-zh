import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import read from "@3-/read";
import { write, findXDeps, toUnixRel } from "./util.js";
import { LIB } from "../const/DIR.js";

export const rewriteImports = (content, dest_file) =>
    content.replace(/(['"])(x\/[^'"]+)\1/g, (match, quote, rel_path) => {
      const rel_p = toUnixRel(dirname(dest_file), join(LIB, rel_path)),
        relative_path = rel_p.startsWith(".") || rel_p.startsWith("/") ? rel_p : "./" + rel_p;
      return quote + relative_path + quote;
    }),
  copyAndResolveX = (filename, cache_dir, processed_x) => {
    if (processed_x.has(filename)) return;
    processed_x.add(filename);
    const src_file = join(cache_dir, "x", filename);
    if (!existsSync(src_file)) return;
    const dest_file = join(LIB, "x", filename),
      content = read(src_file);
    findXDeps(content).forEach((dep) => copyAndResolveX(dep, cache_dir, processed_x));
    mkdirSync(dirname(dest_file), { recursive: true });
    write(dest_file, rewriteImports(content, dest_file));
  };
