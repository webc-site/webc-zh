#!/usr/bin/env bun
import read from "@3-/read";
import write from "@3-/write";
import fmt from "fmt_svelte/fmt.js";
import fix from "~/sh/hook/importFix.js";
import { minifySvelte } from "~/sh/hook/svelteSvgMinify.js";

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

// 1. Fix imports
fix(["svelte"], (line) => /^\s*(?:import|@import)\b/.test(line));

// 2. Format
for (const file of files) {
  if (file.endsWith(".svelte")) {
    const content = read(file);
    if (content) {
      const [out, errors] = await fmt(content, file);
      if (errors?.length) {
        for (const { line, start_line, message, rule_id } of errors) {
          console.error(
            file +
              ":" +
              (line || start_line || "?") +
              ": " +
              message +
              " (" +
              (rule_id || "error") +
              ")",
          );
        }
        process.exit(1);
      }
      if (out !== undefined && out !== content) {
        write(file, out);
      }
    }
  }
}

// 3. Minify SVG in Svelte files
for (const file of files) {
  if (file.endsWith(".svelte")) {
    minifySvelte(file);
  }
}
