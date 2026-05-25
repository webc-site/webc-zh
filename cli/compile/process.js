import { existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { dirname, join, relative, extname, resolve } from "node:path";
import read from "@3-/read";
import stylRender from "./stylus.js";
import { write, findXDeps, toUnixRel } from "./util.js";
import { LIB } from "../const/DIR.js";
import { rewriteImports, copyAndResolveX } from "./xResolve.js";
import { save, URL_REGEX } from "./svg.js";

const processDir = (
  src_dir,
  dest_dir,
  cache_dir,
  imports,
  processed_x,
  canonical_name,
  comp_src_dir,
) => {
  if (!existsSync(src_dir)) return;
  readdirSync(src_dir).forEach((entry) => {
    const src_path = join(src_dir, entry),
      dest_path = join(dest_dir, entry),
      stat = statSync(src_path);

    if (stat.isDirectory()) {
      processDir(
        src_path,
        dest_path,
        cache_dir,
        imports,
        processed_x,
        canonical_name,
        comp_src_dir,
      );
    } else {
      const ext = extname(entry).toLowerCase();
      if ([".styl", ".js", ".svg"].includes(ext)) {
        if (ext === ".svg") {
          const rel_svg = relative(comp_src_dir, src_path);
          save(canonical_name, src_path, rel_svg);
        } else {
          mkdirSync(dirname(dest_path), { recursive: true });
          if (ext === ".styl") {
            const content = read(src_path),
              stylus_css = stylRender(content, src_path),
              dest_css_path = dest_path.slice(0, -ext.length) + ".css",
              css = stylus_css.replace(URL_REGEX, (match, rel_svg) => {
                const [path_part, hash_part = ""] = rel_svg.split(/(?=[#?])/),
                  abs_svg_path = resolve(dirname(src_path), path_part);
                if (existsSync(abs_svg_path)) {
                  const rel_svg_from_comp = toUnixRel(comp_src_dir, abs_svg_path);
                  return (
                    'url("' +
                    save(canonical_name, abs_svg_path, rel_svg_from_comp) +
                    hash_part +
                    '")'
                  );
                }
                return match;
              });
            write(dest_css_path, css);
            imports.push("./" + toUnixRel(LIB, dest_css_path));
          } else if (ext === ".js") {
            const content = read(src_path);
            findXDeps(content).forEach((dep) => copyAndResolveX(dep, cache_dir, processed_x));
            write(dest_path, rewriteImports(content, dest_path));
            imports.push("./" + toUnixRel(LIB, dest_path));
          }
        }
      }
    }
  });
};

export default processDir;
