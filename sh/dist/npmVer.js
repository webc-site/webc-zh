#!/usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import write from "@3-/write";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import ROOT from "~/vite/const/ROOT.js";

const { name, ver } = yargs(hideBin(process.argv)).argv,
  main = () => {
    if (!name || !ver) return;
    for (const dir of [join(ROOT, "conf", "ver"), join(ROOT, ".cache")]) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      write(join(dir, name + ".js"), "export default " + JSON.stringify(ver) + ";\n");
    }
  };

export default main;

if (import.meta.main) {
  main();
}
