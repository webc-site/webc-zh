#!/usr/bin/env bun
import fix from "~/sh/hook/importFix.js";
import fixJs from "~/ai/lib/fixJs.js";
import aiInit from "~/ai/lib/ai.js";
import yaml from "js-yaml";
import read from "@3-/read";
import { dirname, join, resolve } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const ROOT = dirname(dirname(import.meta.dirname));

const main = async () => {
  const argv = yargs(hideBin(process.argv)).argv;
  if (!argv._ || argv._.length === 0) {
    return;
  }

  // 1. 运行 import 路径修正
  fix(["js"], (line) => /^\s*import\b/.test(line));

  // 2. 运行 fixJs 缺陷自动修复
  const rules_path = join(ROOT, "fixJs.yml"),
    rules = (yaml.load(read(rules_path)) || [])
      .filter((r) => r.regex)
      .map((r) => ({ ...r, re: new RegExp(r.regex, "i") })),
    to_fix = [];

  for (const file_path of argv._) {
    const resolved_path = resolve(file_path),
      content = read(resolved_path);
    if (!content) continue;

    const lines = content.split("\n");
    for (const rule of rules) {
      if (lines.some((line) => rule.re.test(line))) {
        to_fix.push(resolved_path);
        break;
      }
    }
  }

  if (to_fix.length > 0) {
    await using ai = await aiInit("使用工具修复 JS 代码");
    for (const file_path of to_fix) {
      await fixJs(file_path, ai);
    }
  }
};

await main();
