#!/usr/bin/env bun

import { existsSync, cpSync, rmSync, readdirSync, statSync, symlinkSync, mkdirSync } from "node:fs";
import { join, basename, relative, dirname, resolve } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import write from "@3-/write";
import read from "@3-/read";
import ext from "@3-/ext";
import COM_PKG from "~/conf/npm/COM_PKG.js";
import { ROOT, writePkg, load, initDir } from "~/sh/dist/dist.js";
import build from "~/vite/dist/comGen.js";
import { GEN_DIR } from "~/vite/dist/comGen/const.js";
import stylRender from "~/cli/compile/stylus.js";
import { URL_REGEX } from "~/cli/compile/svg.js";

const { ver } = yargs(hideBin(process.argv)).argv,
  DIST = join(ROOT, "dist", COM_PKG),
  COM_DIR = join(ROOT, "com"),
  copy = () => {
    const filter = (src_path) => {
      const stat = statSync(src_path),
        name = basename(src_path);
      if (stat.isDirectory()) {
        return name != "demo" && !name.startsWith(".");
      }
      if (name == "Demo.svelte") {
        return false;
      }
      return ["styl", "js", "svg"].includes(ext(name));
    };
    cpSync(COM_DIR, DIST, { recursive: true, filter });
  },
  clean = (dir) => {
    const files = readdirSync(dir);
    if (files.length == 0) {
      rmSync(dir, { recursive: true, force: true });
      return true;
    }
    let all_empty = true;
    for (const file of files) {
      const full_path = join(dir, file);
      if (statSync(full_path).isDirectory()) {
        if (!clean(full_path)) {
          all_empty = false;
        }
      } else {
        all_empty = false;
      }
    }
    if (all_empty) {
      rmSync(dir, { recursive: true, force: true });
      return true;
    }
    return false;
  },
  init = () => {
    initDir(DIST);
    copy();

    for (const name of readdirSync(COM_DIR)) {
      const dir_path = join(DIST, name);
      if (existsSync(dir_path) && statSync(dir_path).isDirectory()) {
        clean(dir_path);
      }
    }

    const x_src = join(ROOT, "x"),
      coms = readdirSync(COM_DIR).filter(
        (file) => statSync(join(COM_DIR, file)).isDirectory() && !file.startsWith("."),
      ),
      index_content = "export default " + JSON.stringify(coms) + ";\n",
      reset_styl = join(ROOT, "styl", "reset.styl");

    for (const name of coms) {
      const var_styl_path = join(DIST, name, "var.styl");
      if (existsSync(var_styl_path)) {
        const var_content = read(var_styl_path),
          lines = var_content.split("\n"),
          cleaned_lines = [];
        for (const line of lines) {
          const match = line.match(/@import\s+['"]\.\.\/([^/]+)\/([^/]+)\.styl['"]/);
          if (!match) {
            cleaned_lines.push(line);
          }
        }
        const cleaned_var = cleaned_lines.join("\n").trim();
        if (cleaned_var === "") {
          rmSync(var_styl_path);
        } else {
          write(var_styl_path, cleaned_lines.join("\n"));
        }
      }

      const com_dir_path = join(DIST, name);
      if (existsSync(com_dir_path)) {
        const styl_files = readdirSync(com_dir_path).filter(
          (file) => file.endsWith(".styl") && statSync(join(com_dir_path, file)).isFile(),
        );

        for (const file of styl_files) {
          const styl_path = join(com_dir_path, file),
            content = read(styl_path),
            raw_css = stylRender(content, styl_path),
            css = raw_css.replace(URL_REGEX, (match, rel_svg) => {
              const [path_part, hash_part = ""] = rel_svg.split(/(?=[#?])/),
                abs_svg_path = resolve(com_dir_path, path_part);
              if (existsSync(abs_svg_path)) {
                const svg_data = read(abs_svg_path),
                  encoded = "data:image/svg+xml;utf8," + encodeURIComponent(svg_data);
                return 'url("' + encoded + hash_part + '")';
              }
              return match;
            }),
            dest_css_path = styl_path.slice(0, -5) + ".css";
          if (css.trim() !== "") {
            write(dest_css_path, css);
          }
          rmSync(styl_path);
        }
      }
    }

    for (const name of coms) {
      const var_styl_src = join(COM_DIR, name, "var.styl"),
        peer_imports = [];
      if (existsSync(var_styl_src)) {
        const var_content = read(var_styl_src),
          lines = var_content.split("\n");
        for (const line of lines) {
          const match = line.match(/@import\s+['"]\.\.\/([^/]+)\/([^/]+)\.styl['"]/);
          if (match) {
            const dep_name = match[1],
              dep_file = match[2];
            const dep_css_filename = dep_file === "var" ? "var.css" : dep_name + ".css",
              dep_css_path = join(DIST, dep_name, dep_css_filename);
            if (existsSync(dep_css_path)) {
              peer_imports.push("./" + dep_name + "/" + dep_css_filename);
            }
          }
        }
      }

      const entry_imports = [],
        com_dir_path = join(DIST, name);
      if (existsSync(com_dir_path)) {
        const css_files = readdirSync(com_dir_path).filter(
            (file) => file.endsWith(".css") && statSync(join(com_dir_path, file)).isFile(),
          ),
          css_imports = css_files.map((file) => "./" + name + "/" + file),
          com_js = join(com_dir_path, name + ".js");
        if (existsSync(com_js)) {
          entry_imports.push("./" + name + "/" + name + ".js");
        }
        css_imports.sort((a, b) => {
          if (a.endsWith("/var.css")) return -1;
          if (b.endsWith("/var.css")) return 1;
          return a.localeCompare(b);
        });
        entry_imports.push(...css_imports);

        const entry_lines = [];
        for (const x of peer_imports) {
          entry_lines.push("import '" + x + "';");
        }
        entry_lines.push(...entry_imports.map((x) => 'import "' + x + '";'));

        if (entry_lines.length > 0) {
          write(join(DIST, name + ".js"), entry_lines.join("\n") + "\n");
        }
      }
    }

    if (existsSync(x_src)) {
      cpSync(x_src, join(DIST, "x"), { recursive: true });
    }
    if (existsSync(reset_styl)) {
      const content = read(reset_styl),
        css = stylRender(content, reset_styl);
      write(join(DIST, "styl", "reset.css"), css);
    }
    write(join(DIST, "index.js"), index_content);
  },
  main = async (out_dir) => {
    const version = await load(COM_PKG, import.meta.filename, ver);
    if (out_dir) {
      const public_com = join(ROOT, "public", "com"),
        coms = readdirSync(COM_DIR).filter(
          (file) => statSync(join(COM_DIR, file)).isDirectory() && !file.startsWith("."),
        );
      for (const dir of [out_dir, GEN_DIR, public_com]) {
        if (existsSync(dir)) {
          rmSync(dir, { recursive: true, force: true });
        }
      }
      const results = await Promise.all(coms.map(build)),
        coms_metadata = results.filter(Boolean);

      if (existsSync(public_com)) {
        rmSync(public_com, { recursive: true, force: true });
      }
      mkdirSync(public_com, { recursive: true });

      const findAndLink = (currentDir) => {
        if (!existsSync(currentDir)) return;
        const entries = readdirSync(currentDir);
        for (const entry of entries) {
          const fullPath = join(currentDir, entry),
            stat = statSync(fullPath);
          if (stat.isDirectory()) {
            findAndLink(fullPath);
          } else if (entry.toLowerCase().endsWith(".svg")) {
            const relToLib = relative(out_dir, fullPath),
              linkPath = join(public_com, relToLib),
              linkDir = dirname(linkPath),
              targetRelPath = relative(linkDir, fullPath);
            if (!existsSync(linkDir)) {
              mkdirSync(linkDir, { recursive: true });
            }
            symlinkSync(targetRelPath, linkPath);
          }
        }
      };
      findAndLink(out_dir);

      return [coms, coms_metadata];
    } else {
      init();
      writePkg(COM_PKG, DIST, version);
    }
  };

export default main;

if (import.meta.main) {
  await main();
}
