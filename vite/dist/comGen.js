import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { build as viteBuild } from "vite";
import read from "@3-/read";
import write from "@3-/write";
import { COM_DIR, LIB_DIR, GEN_DIR } from "~/vite/dist/comGen/const.js";
import compileStylus from "~/vite/dist/comGen/stylus.js";
import { extract as extractSvgs, copyDirSvgs } from "~/cli/compile/svg.js";
import jsMinify from "~/vite/dist/comGen/jsMinify.js";

const CSS = ".css",
  JS = ".js",
  MAP = ".map",
  STYL = ".styl",
  VAR_CSS = "var" + CSS,
  SLASH_VAR_CSS = "/" + VAR_CSS,
  X_PREFIX = "x/";

export default async (name) => {
  const com_path = join(COM_DIR, name),
    com_js = join(com_path, name + JS),
    readme_path = join(com_path, "i18n/zh/README.md"),
    demo_path = join(com_path, "Demo.svelte"),
    output_dir = join(LIB_DIR, name);

  copyDirSvgs(com_path, name);

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
          external: (id) => id.startsWith(X_PREFIX),
        },
      },
    });
    const js_code = read(dest_js)
      .replace(/\/\/#\s*sourceMappingURL=.+$/m, "")
      .replace(/\/\/#\s*debugId=.+$/m, "");
    write(dest_js, js_code);
  }

  const styl_files = readdirSync(com_path).filter(
    (file) => file.endsWith(STYL) && statSync(join(com_path, file)).isFile(),
  );

  for (const file of styl_files) {
    const base = file.slice(0, -STYL.length),
      styl_path = join(com_path, file),
      dest_css = join(output_dir, base + CSS),
      dest_map = join(output_dir, base + CSS + MAP);
    compileStylus(styl_path, dest_css, dest_map, false, name);
  }

  const imports = [],
    css_imports = styl_files.map((file) => {
      const base = file.slice(0, -STYL.length);
      return "./" + name + "/" + base + CSS;
    });

  if (existsSync(com_js)) {
    imports.push("./" + name + "/" + name + JS);
  }
  css_imports.sort((a, b) => {
    if (a.endsWith(SLASH_VAR_CSS)) return -1;
    if (b.endsWith(SLASH_VAR_CSS)) return 1;
    return a.localeCompare(b);
  });
  imports.push(...css_imports);

  if (imports.length > 0) {
    const entry_content = imports.map((x) => 'import "' + x + '";').join("\n") + "\n";
    write(join(LIB_DIR, name + JS), entry_content);
  }

  if (existsSync(readme_path) && existsSync(demo_path)) {
    const readme = read(readme_path),
      lines = readme.split("\n"),
      first_line = (lines[0] || "").replace(/^#\s*/, "").trim(),
      doc_readme = lines.slice(1).join("\n").trim(),
      svgs = extractSvgs(com_path),
      files = [],
      css_files = styl_files.map((file) => name + "/" + file.slice(0, -STYL.length) + CSS),
      cdn_files = [];

    if (existsSync(com_js) || styl_files.length > 0) {
      files.push(name + JS);
    }
    css_files.sort((a, b) => {
      if (a.endsWith(SLASH_VAR_CSS)) return -1;
      if (b.endsWith(SLASH_VAR_CSS)) return 1;
      return a.localeCompare(b);
    });
    files.push(...css_files);

    if (existsSync(com_js)) {
      cdn_files.push(name + JS);
    }
    if (styl_files.length > 0) {
      const has_var = styl_files.some((file) => file.slice(0, -STYL.length) === "var");
      if (has_var) {
        cdn_files.push(name + CSS);
      } else {
        cdn_files.push("_" + name + CSS);
      }
    }

    const doc_js = [
      "export default [",
      "  " + JSON.stringify(doc_readme) + ",",
      '  () => import("../../../com/' + name + '/Demo.svelte"),',
      "  " + JSON.stringify(svgs) + ",",
      "  " + JSON.stringify(cdn_files),
      "];",
    ].join("\n");
    write(join(GEN_DIR, "com", "md", name + JS), jsMinify(doc_js));
    return [name, first_line, '() => import("./md/' + name + '.js")'];
  }
  return null;
};
