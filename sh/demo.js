#!/usr/bin/env bun

import {
  existsSync,
  mkdirSync,
  cpSync,
  statSync,
  symlinkSync,
  rmSync,
  readdirSync,
  realpathSync,
} from "node:fs";
import { join, resolve, basename, relative } from "node:path";
import stylRender from "~/vite/stylus.js";
import { transform } from "lightningcss";
import pug from "pug";
import read from "@3-/read";
import write from "@3-/write";
import pug_conf from "~/conf/pug.js";
import buildCdn from "~/sh/dist/cdn.js";
import CDN_PKG from "~/conf/npm/CDN_PKG.js";
import ROOT from "~/vite/const/ROOT.js";

const args = process.argv.slice(2),
  raw_path = args.find((x) => !x.startsWith("-"));

if (!raw_path) {
  console.error("Please provide a component name or folder path");
  process.exit(1);
}

const input_path =
    raw_path.startsWith("com/") || raw_path.startsWith("./com/") ? raw_path : join("com", raw_path),
  absolute_path = resolve(ROOT, input_path),
  name = basename(absolute_path),
  demo_dir = join(absolute_path, "demo"),
  port_idx = args.indexOf("--port"),
  port = port_idx !== -1 && args[port_idx + 1] ? parseInt(args[port_idx + 1], 10) : 1900;

if (!existsSync(absolute_path) || !statSync(absolute_path).isDirectory()) {
  console.error("Invalid folder path: " + input_path);
  process.exit(1);
}

const js_path = join(demo_dir, "_.js"),
  htm_path = join(demo_dir, "_.htm"),
  css_path = join(demo_dir, "_.css");

if (!existsSync(htm_path)) {
  console.error("Demo HTML file not found. Make sure _.htm exists in " + demo_dir);
  process.exit(1);
}

console.log("Calling cdn.js to build cdn...");
await buildCdn();

const dist_dir = join(ROOT, "dist/demo", name),
  cdn_dir = join(ROOT, "dist", CDN_PKG),
  inlineCss = (css_path) => {
    if (!existsSync(css_path)) return "";
    const import_re = /@import\s+["']\.\/([^"']+)\.css["'];/g;
    return read(css_path).replace(import_re, (match, dep_name) => {
      let dep_path = join(cdn_dir, dep_name + ".css");
      if (!existsSync(dep_path)) {
        dep_path = join(cdn_dir, "_" + dep_name + ".css");
      }
      if (!existsSync(dep_path)) {
        dep_path = join(cdn_dir, dep_name + "_.css");
      }
      return inlineCss(dep_path);
    });
  };

let src_js = join(cdn_dir, name + ".js"),
  src_css = join(cdn_dir, name + ".css");

if (!existsSync(src_css)) {
  src_css = join(cdn_dir, name + "_.css");
}

const cpFile = (src, dest_dir) => {
  if (existsSync(src)) {
    const file_name = basename(src);
    cpSync(src, join(dest_dir, file_name));
    const map = src + ".map";
    if (existsSync(map)) {
      cpSync(map, join(dest_dir, file_name + ".map"));
    }
    return true;
  }
  return false;
};

mkdirSync(dist_dir, { recursive: true });

// Copy component files
const has_js = cpFile(src_js, dist_dir);
let has_css = false;

if (existsSync(src_css)) {
  const file_name = basename(src_css);
  write(join(dist_dir, file_name), inlineCss(src_css));
  const map = src_css + ".map";
  if (existsSync(map)) {
    cpSync(map, join(dist_dir, file_name + ".map"));
  }
  has_css = true;
}

cpFile(join(cdn_dir, "x.js"), dist_dir);

// Compile stylus theme and output to dist/demo/ComponentName/_.css
const styl_dir = join(ROOT, "styl"),
  out_theme_css = join(dist_dir, "_.css");
if (existsSync(styl_dir)) {
  const files = readdirSync(styl_dir)
      .filter((file) => file.endsWith(".styl"))
      .sort((a, b) => (a == "reset.styl" ? -1 : b == "reset.styl" ? 1 : a.localeCompare(b))),
    css_raw = files
      .map((file) => {
        const file_path = join(styl_dir, file),
          real_path = realpathSync(file_path),
          content = read(real_path);
        return stylRender(content, real_path);
      })
      .join("\n"),
    { code } = transform({
      filename: "_.css",
      code: Buffer.from(css_raw),
      minify: true,
      sourceMap: false,
    }),
    css = code.toString();
  write(out_theme_css, css);
}

// Symlink x to dist/demo/ComponentName/x
const target_link = join(dist_dir, "x"),
  source_dir = join(ROOT, "x"),
  rel_path = relative(dist_dir, source_dir);
if (existsSync(target_link)) {
  rmSync(target_link, { recursive: true, force: true });
}
symlinkSync(rel_path, target_link, "dir");

const demo_htm = read(htm_path),
  demo_js = existsSync(js_path) ? read(js_path) : "",
  demo_css = existsSync(css_path) ? read(css_path) : "",
  compileFn = pug.compileFile(join(ROOT, "pug/demo.pug"), {
    basedir: ROOT,
  }),
  html_content = compileFn({
    ...pug_conf,
    title: name + " - Demo",
    theme: "./_.css",
    css_link_href: has_css ? basename(src_css) : "",
    js_script_href: has_js ? basename(src_js) : "",
    demo_css,
    demo_htm,
    demo_js,
  }),
  dest_html_path = join(dist_dir, "index.html"),
  is_interactive =
    process.stdout.isTTY || args.some((x) => ["-o", "--open", "-i", "--interactive"].includes(x));

write(dest_html_path, html_content);
console.log("Successfully built demo to " + dest_html_path);

if (is_interactive) {
  Bun.serve({
    port,
    hostname: "127.0.0.1",
    fetch(req) {
      let { pathname } = new URL(req.url);
      if (pathname === "/") {
        pathname = "/index.html";
      }
      const file_path = join(dist_dir, pathname);
      if (file_path.startsWith(dist_dir) && existsSync(file_path) && statSync(file_path).isFile()) {
        return new Response(Bun.file(file_path));
      }
      const public_file = join(ROOT, "public", pathname);
      if (existsSync(public_file) && statSync(public_file).isFile()) {
        return new Response(Bun.file(public_file));
      }
      const cdn_file = join(cdn_dir, pathname);
      if (existsSync(cdn_file) && statSync(cdn_file).isFile()) {
        return new Response(Bun.file(cdn_file));
      }
      return new Response("Not Found", { status: 404 });
    },
  });
  console.log("Server running at http://127.0.0.1:" + port + "/");
}
