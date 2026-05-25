#!/usr/bin/env bun

import { readdirSync, existsSync, statSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import { transform } from "lightningcss";
import CDN_PKG from "~/conf/npm/CDN_PKG.js";
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
  processCssSvgs = (css_content, entry) => {
    const url_re = /url\(\s*['"]?([^'")?#]+?\.svg)(?:\?[^'")]*|#[^'")]*)?['"]?\s*\)/g;
    return css_content.replace(url_re, (match, svg_url) => {
      if (
        svg_url.startsWith("data:") ||
        svg_url.startsWith("http://") ||
        svg_url.startsWith("https://")
      ) {
        return match;
      }
      const base_dir = entry ? join(ROOT, "com", entry) : join(ROOT, "styl"),
        svg_path = svg_url.startsWith("/") ? join(ROOT, svg_url) : join(base_dir, svg_url);
      if (existsSync(svg_path)) {
        const svg_data = readFileSync(svg_path),
          md5_base64url = createHash("md5").update(svg_data).digest("base64url"),
          hashed_filename = md5_base64url + ".svg",
          dest_svg_path = join(DIST, hashed_filename);
        writeFileSync(dest_svg_path, svg_data);
        return 'url("' + hashed_filename + '")';
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
    let css_code = code.toString().replace(/\/\*#\s*sourceMappingURL=.+?\*\//g, "");
    writeFileSync(dest_path, css_code);
    writeFileSync(map_dest_path, map.toString());
  },
  initDist = async () => {
    await com();
    initDir(DIST);
    for (const entry of readdirSync(LIB_DIR)) {
      const full_path = join(LIB_DIR, entry);
      if (statSync(full_path).isDirectory()) {
        const var_css_path = join(full_path, VAR_CSS),
          com_css_path = join(full_path, entry + CSS),
          com_js_path = join(full_path, entry + JS),
          has_var = existsSync(var_css_path),
          has_com_css = existsSync(com_css_path);

        if (has_com_css) {
          const com_css_content = read(com_css_path);
          minifyCss(
            com_css_content,
            PREFIX_UNDER + entry + CSS,
            join(DIST, PREFIX_UNDER + entry + CSS),
            join(DIST, PREFIX_UNDER + entry + CSS + MAP),
            entry,
          );
          if (has_var) {
            const var_content = read(var_css_path);
            minifyCss(
              var_content + "\n" + com_css_content,
              entry + CSS,
              join(DIST, entry + CSS),
              join(DIST, entry + CSS + MAP),
              entry,
            );
          }
        } else if (has_var) {
          const var_content = read(var_css_path);
          minifyCss(
            var_content,
            entry + CSS,
            join(DIST, entry + CSS),
            join(DIST, entry + CSS + MAP),
            entry,
          );
        }

        if (existsSync(com_js_path)) {
          const js_content = read(com_js_path)
              .replace(/\/\/#\s*sourceMappingURL=.+$/m, "")
              .replace(/\/\/#\s*debugId=.+$/m, ""),
            com_js_map_path = com_js_path + MAP;

          writeFileSync(join(DIST, entry + JS), js_content);
          if (existsSync(com_js_map_path)) {
            const js_map_content = read(com_js_map_path);
            writeFileSync(join(DIST, entry + JS + MAP), js_map_content);
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
      writeFileSync(reset_css, reset_content);
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
