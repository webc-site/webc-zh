#!/usr/bin/env bun

import { existsSync, rmSync, readdirSync, statSync, symlinkSync, mkdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import COM_PKG from "~/conf/web/npm/COM_PKG.js";
import { ROOT, writePkg, load } from "~/sh/dist/dist.js";
import build from "~/vite/dist/comGen.js";
import { GEN_DIR } from "~/vite/dist/comGen/const.js";
import init from "~/sh/dist/com/init.js";

const { ver } = yargs(hideBin(process.argv)).argv,
  DIST = join(ROOT, "dist", COM_PKG),
  COM_DIR = join(ROOT, "com"),
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
