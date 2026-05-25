import { existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, extname, resolve } from "node:path";
import read from "@3-/read";
import { write, copy, findXDeps } from "./util.js";
import { LIB, CSS } from "../const/DIR.js";
import { rewriteImports, copyAndResolveX } from "./xResolve.js";

const parseImports = (content) => {
  const imports = [];
  const regex = /import\s+['"](\.\.?\/[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
};

export default (dir, canonical_name) => {
  const pkg_path = join(dir, "package.json"),
    pkg = existsSync(pkg_path) ? JSON.parse(read(pkg_path)) : {},
    header =
      pkg.name && pkg.version
        ? "// " + pkg.name + "@" + pkg.version + (pkg.homepage ? " " + pkg.homepage : "") + "\n\n"
        : "",
    processed_x = new Set(),
    processed_files = new Set(),
    package_styl_dir = join(dir, "styl");

  const entry_js_name = canonical_name + ".js",
    src_entry = join(dir, entry_js_name),
    dest_entry = join(LIB, entry_js_name);

  const copyAndProcess = (src_path, dest_path) => {
    if (processed_files.has(src_path)) return;
    processed_files.add(src_path);

    if (!existsSync(src_path)) return;

    const ext = extname(src_path).toLowerCase();
    mkdirSync(dirname(dest_path), { recursive: true });

    if (ext === ".js") {
      const content = read(src_path);
      findXDeps(content).forEach((dep) => copyAndResolveX(dep, dir, processed_x));
      write(dest_path, rewriteImports(content, dest_path));

      const rel_imports = parseImports(content);
      for (const rel_import of rel_imports) {
        const import_src = resolve(dirname(src_path), rel_import),
          import_dest = resolve(dirname(dest_path), rel_import);
        copyAndProcess(import_src, import_dest);
      }
    } else {
      copy(src_path, dest_path);
    }
  };

  if (existsSync(src_entry)) {
    const entry_content = read(src_entry);
    mkdirSync(dirname(dest_entry), { recursive: true });
    write(dest_entry, header + entry_content);
    processed_files.add(src_entry);

    const rel_imports = parseImports(entry_content);
    for (const rel_import of rel_imports) {
      const import_src = resolve(dir, rel_import),
        import_dest = resolve(LIB, rel_import);
      copyAndProcess(import_src, import_dest);
    }
  }

  if (existsSync(package_styl_dir)) {
    readdirSync(package_styl_dir).forEach((entry) => {
      const src_path = join(package_styl_dir, entry),
        dest_path = join(CSS, entry);
      if (entry.endsWith(".css")) {
        mkdirSync(dirname(dest_path), { recursive: true });
        copy(src_path, dest_path);
      }
    });
  }
};
