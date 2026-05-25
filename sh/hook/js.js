#!/usr/bin/env bun
import fix from "~/sh/hook/importFix.js";

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

fix(["js"], (line) => /^\s*import\b/.test(line));
