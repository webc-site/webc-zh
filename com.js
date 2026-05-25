#!/usr/bin/env bun

import { readdirSync, existsSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";
import { COM_DIR, LIB_DIR, GEN_DIR } from "~/vite/dist/comGen/const.js";
import build from "~/vite/dist/comGen.js";
import docGen from "~/vite/gen/doc.js";

const comList = () => {
    if (!existsSync(COM_DIR)) {
      return [];
    }
    return readdirSync(COM_DIR).filter(
      (file) => statSync(join(COM_DIR, file)).isDirectory() && !file.startsWith("."),
    );
  },
  main = async () => {
    for (const dir of [LIB_DIR, GEN_DIR]) {
      if (existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true });
      }
    }

    const coms = comList(),
      results = await Promise.all(coms.map(build)),
      coms_metadata = results.filter(Boolean);

    docGen(coms, coms_metadata);
  };

export default main;

if (import.meta.main) {
  await main();
}
