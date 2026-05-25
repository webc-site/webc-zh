import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

export default () => ({
  name: "vite-plugin-com-svg",
  enforce: "post",
  transform(code, id) {
    const clean_id = id.split("?")[0];
    if (!clean_id.includes("/com/") || !/\.(styl|svelte|css|js|ts)$/.test(clean_id)) {
      return null;
    }

    let has_changes = false;
    const url_re = /url\(\s*['"]?([^'"/):][^'")]*?\.svg(?:[#?][^'")]*)?)['"]?\s*\)/g,
      new_code = code.replace(url_re, (match, rel_path) => {
        const [path_part, hash_part = ""] = rel_path.split(/(?=[#?])/),
          svg_path = resolve(dirname(clean_id), path_part);
        if (existsSync(svg_path)) {
          const base64 = readFileSync(svg_path).toString("base64");
          has_changes = true;
          return 'url("data:image/svg+xml;base64,' + base64 + hash_part + '")';
        } else {
          console.warn("⚠️ [comSvg] File does NOT exist: " + svg_path);
        }
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
