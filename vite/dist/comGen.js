import { existsSync, readdirSync, statSync, mkdirSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { build as viteBuild } from "vite";
import read from "@3-/read";
import write from "@3-/write";
import { COM_DIR, LIB_DIR } from "~/vite/dist/comGen/const.js";
import compileStylus from "~/vite/dist/comGen/stylus.js";

const copySvgs = (src, dest) => {
    if (!existsSync(src)) return;
    const stat = statSync(src);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(src)) {
        if (entry.startsWith(".")) continue;
        copySvgs(join(src, entry), join(dest, entry));
      }
    } else if (src.toLowerCase().endsWith(".svg")) {
      const dir = dirname(dest);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      cpSync(src, dest);
    }
  },
  CSS = ".css",
  JS = ".js",
  MAP = ".map",
  STYL = ".styl",
  VAR_CSS = "var" + CSS,
  SLASH_VAR_CSS = "/" + VAR_CSS,
  X_PREFIX = "x/";

export default async (name) => {
  const com_path = join(COM_DIR, name),
    com_js = join(com_path, name + JS),
    output_dir = join(LIB_DIR, name),
    styl_files = readdirSync(com_path).filter(
      (file) => file.endsWith(STYL) && statSync(join(com_path, file)).isFile(),
    ),
    imports = [],
    css_imports = styl_files.map((file) => "./" + name + "/" + file.slice(0, -STYL.length) + CSS),
    peer_imports = [],
    var_styl_path = join(com_path, "var.styl"),
    entry_lines = [];

  copySvgs(com_path, output_dir);

  if (existsSync(com_js)) {
    const dest_js = join(output_dir, name + JS);
    await viteBuild({
      configFile: false,
      publicDir: false,
      logLevel: "error",
      build: {
        lib: {
          entry: com_js,
          formats: ["es"],
          fileName: () => name + JS,
        },
        outDir: output_dir,
        minify: true,
        sourcemap: true,
        emptyOutDir: false,
        rollupOptions: {
          // 不打包 x/ 以及跨组件的相对引用（以 ../ 开头）
          external: (id) => id.startsWith(X_PREFIX) || id.startsWith("../"),
        },
      },
    });
    write(
      dest_js,
      read(dest_js)
        .replace(/\/\/#\s*sourceMappingURL=.+$/m, "")
        .replace(/\/\/#\s*debugId=.+$/m, ""),
    );
  }

  for (const file of styl_files) {
    const base = file.slice(0, -STYL.length),
      styl_path = join(com_path, file),
      dest_css = join(output_dir, base + CSS),
      dest_map = join(output_dir, base + CSS + MAP);
    compileStylus(styl_path, dest_css, dest_map, false, name);
  }

  if (existsSync(com_js)) {
    imports.push("./" + name + "/" + name + JS);
  }
  css_imports.sort((a, b) => {
    if (a.endsWith(SLASH_VAR_CSS)) return -1;
    if (b.endsWith(SLASH_VAR_CSS)) return 1;
    return a.localeCompare(b);
  });
  imports.push(...css_imports);

  if (existsSync(var_styl_path)) {
    const var_content = read(var_styl_path),
      lines = var_content.split("\n");
    for (const line of lines) {
      const match = line.match(/@import\s+['"]\.\.\/([^/]+)\/([^/]+)\.styl['"]/);
      if (match) {
        const dep_name = match[1],
          dep_file = match[2];
        if (dep_file === "var") {
          peer_imports.push("./" + dep_name + "/var.css");
        } else {
          peer_imports.push("./" + dep_name + "/" + dep_name + ".css");
        }
      }
    }
  }

  for (const x of peer_imports) {
    entry_lines.push("import '" + x + "';");
  }
  entry_lines.push(...imports.map((x) => 'import "' + x + '";'));

  if (entry_lines.length > 0) {
    write(join(LIB_DIR, name + JS), entry_lines.join("\n") + "\n");
  }
};
