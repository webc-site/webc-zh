#!/usr/bin/env bun

import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import write from "@3-/write";
import { transform } from "lightningcss";
import CDN_PKG from "~/conf/web/npm/CDN_PKG.js";
import com from "~/com.js";
import { packImportmap } from "~/vite/dist/cdn/importmapPack.js";
import resolveDeps from "~/vite/importmapDeps.js";
import refactor from "~/vite/dist/refactor.js";
import compileStylus from "~/vite/dist/comGen/stylus.js";
import { ROOT, writePkg, load, initDir } from "~/sh/dist/dist.js";

const { ver } = yargs(hideBin(process.argv)).argv,
  DIST = join(ROOT, "dist", CDN_PKG),
  LIB_DIR = join(ROOT, "lib"),
  CSS = ".css",
  JS = ".js",
  MAP = ".map",
  STYL = ".styl",
  VAR_CSS = "var" + CSS,
  PREFIX_UNDER = "_",
  RESET = "reset",
  X = "x",
  varImports = (entry) => {
    const var_styl = join(ROOT, "com", entry, "var.styl");
    if (!existsSync(var_styl)) return "";
    const content = read(var_styl),
      imports = [...content.matchAll(/@import\s+['"]\.\.\/([^/]+)\/([^/]+)\.styl['"]/g)]
        .filter(([, , imported_file]) => imported_file !== "var")
        .map(([, imported_com]) => '@import "./' + imported_com + '.css";');
    return imports.length > 0 ? imports.join("\n") + "\n" : "";
  },
  processCssSvgs = (css_content, entry) => {
    const url_re = /url\(\s*['"]?([^'")?#]+?\.svg)(?:\?[^'")]*|#[^'")]*)?['"]?\s*\)/g;
    return css_content.replace(url_re, (match, svg_url) => {
      if (/^(?:data:|https?:)/.test(svg_url)) {
        return match;
      }
      const base_dir = entry ? join(ROOT, "com", entry) : join(ROOT, "styl"),
        svg_path = svg_url.startsWith("/") ? join(ROOT, svg_url) : join(base_dir, svg_url);
      if (existsSync(svg_path)) {
        const svg_data = read(svg_path),
          encoded = "data:image/svg+xml;utf8," + encodeURIComponent(svg_data);
        return 'url("' + encoded + '")';
      } else {
        console.warn("⚠️ [cdn.js] SVG file does not exist: " + svg_path);
        return match;
      }
    });
  },
  minifyCss = (css_content, filename, dest_path, map_dest_path, entry) => {
    const processed_css = processCssSvgs(css_content, entry),
      { code, map } = transform({
        filename,
        code: Buffer.from(processed_css),
        minify: true,
        sourceMap: true,
      });
    const css_code = code.toString().replace(/\/\*#\s*sourceMappingURL=.+?\*\//g, "");
    write(dest_path, css_code);
    write(map_dest_path, map.toString());
  },
  initDist = async () => {
    await com();
    initDir(DIST);
    for (const dirent of readdirSync(LIB_DIR, { withFileTypes: true })) {
      if (dirent.isDirectory()) {
        const { name: entry } = dirent,
          full_path = join(LIB_DIR, entry),
          var_css_path = join(full_path, VAR_CSS),
          com_css_path = join(full_path, entry + CSS),
          com_js_path = join(full_path, entry + JS),
          has_var = existsSync(var_css_path),
          has_com_css = existsSync(com_css_path),
          extra_imports = varImports(entry),
          tasks = [];

        if (has_com_css) {
          const com_css_content = read(com_css_path);
          tasks.push([extra_imports + com_css_content, PREFIX_UNDER + entry + CSS]);
          tasks.push([
            extra_imports + (has_var ? read(var_css_path) + "\n" : "") + com_css_content,
            entry + CSS,
          ]);
        } else if (has_var) {
          tasks.push([extra_imports + read(var_css_path), entry + CSS]);
        }

        for (const [content, filename] of tasks) {
          const dest_path = join(DIST, filename);
          minifyCss(content, filename, dest_path, dest_path + MAP, entry);
        }

        if (existsSync(com_js_path)) {
          const entry_js = entry + JS,
            com_js_map_path = com_js_path + MAP,
            js_content = read(com_js_path)
              .replace(/\/\/#\s*sourceMappingURL=.+$/m, "")
              .replace(/\/\/#\s*debugId=.+$/m, "")
              // 扁平化 CDN 目录，将跨组件的相对引用 ../Name/Name.js 改为同级引用 ./Name.js
              .replace(/\.\.\/([^/]+)\/\1\.js/g, "./$1.js");

          write(join(DIST, entry_js), js_content);
          if (existsSync(com_js_map_path)) {
            write(join(DIST, entry_js + MAP), read(com_js_map_path));
          }
        }
      }
    }

    const reset_styl = join(ROOT, "styl", RESET + STYL);
    if (existsSync(reset_styl)) {
      const reset_css = join(DIST, RESET + CSS),
        reset_map = join(DIST, RESET + CSS + MAP);
      compileStylus(reset_styl, reset_css, reset_map, false);
      const reset_content = processCssSvgs(read(reset_css), null);
      write(reset_css, reset_content);
    }
  },
  main = async () => {
    const version = await load(CDN_PKG, import.meta.filename, ver),
      collected_x_files = new Set();

    await initDist();
    refactor(DIST, X, collected_x_files);
    const all_used = new Set(collected_x_files);
    for (const file of collected_x_files) {
      resolveDeps(X, file, all_used);
    }
    await packImportmap(DIST, X, all_used);
    writePkg(CDN_PKG, DIST, version);
  };

export default main;

if (import.meta.main) {
  await main();
}
