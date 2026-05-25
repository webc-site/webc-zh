#!/usr/bin/env bun

import { existsSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import ROOT from "~/vite/const/ROOT.js";
// import init from "~/sh/init.js";

const CONF = join(ROOT, "conf");

// await init();

if (!existsSync(CONF)) {
  symlinkSync("sh/example/conf", CONF, "dir");
}
