import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, basename, join } from "node:path";
import read from "@3-/read";

const encodeSvg = (path) => "data:image/svg+xml;utf8," + encodeURIComponent(read(path));

export default () => ({
  name: "vite-plugin-com-svg",
  enforce: "post",
  transform(code, id) {
    const clean_id = id.split("?")[0];
    if (!clean_id.includes("/com/") || !/\.(styl|svelte|css|js|ts)$/.test(clean_id)) {
      return null;
    }

    let has_changes = false;
    const url_re = /url\(\s*(\\?['"])?([^'"\\)]+?\.svg(?:[#?][^'"\\)]*)?)\\?['"]?\s*\)/g,
      new_code = code.replace(url_re, (match, quote = "", rel_path) => {
        const [path_part, hash_part = ""] = rel_path.split(/(?=[#?])/),
          svg_path = resolve(dirname(clean_id), path_part);
        if (existsSync(svg_path)) {
          has_changes = true;
          return "url(" + quote + encodeSvg(svg_path) + hash_part + quote + ")";
        }

        const com_idx = clean_id.indexOf("/com/");
        if (com_idx !== -1) {
          const com_root = clean_id.slice(0, com_idx + 5),
            svg_file_name = basename(path_part);
          for (const sub of readdirSync(com_root)) {
            if (sub.startsWith(".")) continue;
            const sub_dir = join(com_root, sub);
            if (statSync(sub_dir).isDirectory()) {
              const candidate = join(sub_dir, "svg", svg_file_name);
              if (existsSync(candidate)) {
                has_changes = true;
                return "url(" + quote + encodeSvg(candidate) + hash_part + quote + ")";
              }
            }
          }
        }

        console.warn("⚠️ [comSvg] File does NOT exist: " + svg_path);
        return match;
      });

    if (has_changes) {
      return {
        code: new_code,
        map: null,
      };
    }
    return null;
  },
});
