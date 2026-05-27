import { existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, resolve, basename, relative } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import { PUBLIC } from "../const/DIR.js";

export const URL_REGEX = /url\(\s*['"]?([^'"/):][^'")]*?\.svg(?:[#?][^'")]*)?)['"]?\s*\)/g,
  save = (com_name, svg_path, rel_path) => {
    const clean_rel_path = rel_path.startsWith("./") ? rel_path.slice(2) : rel_path,
      content = readFileSync(svg_path);
    write(join(PUBLIC, "com", com_name, clean_rel_path), content);
    return "/com/" + com_name + "/" + clean_rel_path;
  },
  copyDirSvgs = (src_dir, com_name, current_dir = src_dir) => {
    if (!existsSync(current_dir)) return;
    readdirSync(current_dir).forEach((entry) => {
      const src_path = join(current_dir, entry),
        stat = statSync(src_path);
      if (stat.isDirectory()) {
        copyDirSvgs(src_dir, com_name, src_path);
      } else if (entry.toLowerCase().endsWith(".svg")) {
        const rel_path = relative(src_dir, src_path);
        save(com_name, src_path, rel_path);
      }
    });
  },
  extract = (com_path) => {
    const com_name = basename(com_path),
      var_path = join(com_path, "var.styl"),
      svgs = [];
    if (existsSync(var_path)) {
      const var_content = read(var_path),
        var_lines = var_content.split("\n"),
        var_line_re = /^\s*(--\w+Svg)\s+(.+)$/;
      for (const line of var_lines) {
        const match = var_line_re.exec(line);
        if (!match) {
          continue;
        }
        const [, name, value] = match,
          url_match = /url\(\s*['"]?([^'")]+?\.svg(?:[#?][^'")]*)?)['"]?\s*\)/.exec(value);
        if (!url_match) {
          continue;
        }
        const [, raw_path] = url_match,
          [path_part, hash_part = ""] = raw_path.split(/(?=[#?])/),
          rel_path = path_part.startsWith("./") ? path_part.slice(2) : path_part,
          svg_abs_path = resolve(com_path, rel_path);
        if (existsSync(svg_abs_path)) {
          svgs.push([name, save(com_name, svg_abs_path, rel_path) + hash_part, rel_path]);
        }
      }
    }
    return svgs;
  };
