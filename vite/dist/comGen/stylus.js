import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import read from "@3-/read";
import stylRender from "~/vite/stylus.js";
import { transform } from "lightningcss";
import write from "@3-/write";
import { URL_REGEX } from "~/cli/src/compile/svg.js";

export default (styl_path, dest_path, map_dest_path, import_var, com_name) => {
  let content = read(styl_path);
  if (styl_path.endsWith("var.styl")) {
    content = content.replace(/@import\s+['"]\.\.\/[^'"]+['"]/g, "");
  }
  const com_dir = dirname(styl_path);
  if (import_var && existsSync(join(com_dir, "var.styl"))) {
    content = '@import "./var.styl"\n' + content;
  }
  const raw_css = stylRender(content, styl_path),
    rewritten_css = raw_css.replace(URL_REGEX, (match, rel_path) => {
      const [path_part, hash_part = ""] = rel_path.split(/(?=[#?])/),
        svg_path = resolve(com_dir, path_part);
      if (existsSync(svg_path)) {
        const svg_data = read(svg_path),
          encoded = "data:image/svg+xml;utf8," + encodeURIComponent(svg_data);
        return 'url("' + encoded + hash_part + '")';
      }
      console.warn("⚠️ SVG file not found: " + svg_path);
      return match;
    }),
    { code, map } = transform({
      filename: resolve(dest_path),
      code: Buffer.from(rewritten_css),
      minify: true,
      sourceMap: true,
    }),
    css_code = code.toString().replace(/\/\*#\s*sourceMappingURL=.+?\*\//g, "");
  write(dest_path, css_code);
  write(map_dest_path, map.toString());
};
