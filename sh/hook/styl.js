#!/usr/bin/env bun
import read from "@3-/read";
import write from "@3-/write";
import yaml from "js-yaml";
import { format } from "stylus-supremacy";
import fix from "~/sh/hook/importFix.js";

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

// 1. Fix imports
fix(["styl"], (line) => /^\s*@import\b/.test(line));

// Load supremacy config
const options = {};
try {
  const content = read("supremacy.yml");
  if (content) {
    const raw = yaml.load(content);
    for (const [k, v] of Object.entries(raw)) {
      options[k.replace(/^stylusSupremacy\./, "")] = v;
    }
  }
} catch (e) {
  console.error("Failed to load supremacy.yml: " + e.message);
}

// 2. Format
for (const file of files) {
  if (file.endsWith(".styl")) {
    try {
      const original = read(file);
      if (original) {
        const formatted = format(original, options);
        if (formatted !== original) {
          write(file, formatted);
        }
      }
    } catch (e) {
      console.error("Error formatting " + file + ": " + e.message);
      process.exit(1);
    }
  }
}
