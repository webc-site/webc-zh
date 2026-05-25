#!/usr/bin/env bun

import { existsSync, cpSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import write from "@3-/write";
import COM_PKG from "~/conf/npm/COM_PKG.js";
import { ROOT, writePkg, load, initDir } from "~/sh/dist/dist.js";

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
      return name.endsWith(".styl") || name.endsWith(".js") || name.endsWith(".svg");
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

    if (existsSync(x_src)) {
      cpSync(x_src, join(DIST, "x"), { recursive: true });
    }
    if (existsSync(reset_styl)) {
      cpSync(reset_styl, join(DIST, "styl", "reset.styl"), { recursive: true });
    }
    write(join(DIST, "index.js"), index_content);
  },
  main = async () => {
    const version = await load(COM_PKG, import.meta.filename, ver);
    init();
    writePkg(COM_PKG, DIST, version);
  };

export default main;

if (import.meta.main) {
  await main();
}
