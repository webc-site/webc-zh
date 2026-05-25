import { existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import read from "@3-/read";
import stylRender from "./stylus.js";
import { write } from "./util.js";
import { LIB, CSS } from "../const/DIR.js";
import processDir from "./process.js";

const compileStylDir = (styl_dir, output_dir) => {
  if (!existsSync(styl_dir)) return;
  readdirSync(styl_dir).forEach((entry) => {
    const src_path = join(styl_dir, entry),
      dest_path = join(output_dir, entry),
      stat = statSync(src_path);

    if (stat.isDirectory()) {
      compileStylDir(src_path, dest_path);
    } else {
      const ext = extname(entry).toLowerCase();
      if (ext === ".styl") {
        const content = read(src_path),
          stylus_css = stylRender(content, src_path),
          dest_css_path = dest_path.slice(0, -ext.length) + ".css";
        mkdirSync(dirname(dest_css_path), { recursive: true });
        write(dest_css_path, stylus_css);
      }
    }
  });
};

export default (dir, canonical_name) => {
  const pkg_path = join(dir, "package.json"),
    pkg = existsSync(pkg_path) ? JSON.parse(read(pkg_path)) : {},
    header =
      pkg.name && pkg.version
        ? "// " + pkg.name + "@" + pkg.version + (pkg.homepage ? " " + pkg.homepage : "") + "\n\n"
        : "",
    imports = [],
    processed_x = new Set(),
    comp_src_dir = join(dir, canonical_name),
    package_styl_dir = join(dir, "styl");

  processDir(
    comp_src_dir,
    join(LIB, canonical_name),
    dir,
    imports,
    processed_x,
    canonical_name,
    comp_src_dir,
  );

  if (existsSync(package_styl_dir)) {
    compileStylDir(package_styl_dir, CSS);
  }

  const filterSort = (ext) => imports.filter((x) => x.endsWith(ext)).sort(),
    import_content =
      header +
      [...filterSort(".js"), ...filterSort(".css")].map((x) => 'import "' + x + '";').join("\n") +
      "\n";
  write(join(LIB, canonical_name + ".js"), import_content);
};
