#!/usr/bin/env bun

import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import yaml from "js-yaml";
import read from "@3-/read";
import md5B64 from "@3-/base64url/md5B64.js";
import aiInit from "~/ai/lib/ai.js";
import gitLs from "~/ai/lib/gitLs.js";
import fixSingle from "~/ai/lib/fixJs.js";

const ROOT = dirname(import.meta.dirname),
  main = async () => {
    const [changed, save] = await gitLs("js", "fixJs"),
      rules_path = join(ROOT, "fixJs.yml"),
      rules = yaml.load(read(rules_path)) || [],
      to_fix = [];

    if (changed.length === 0) {
      console.log("没有检测到需要修复的 JS 文件");
      return;
    }

    for (const item of changed) {
      const matched_rule = rules.find((rule) => {
        if (!rule.regex) return false;
        const re = new RegExp(rule.regex, "i");
        return item.code.split("\n").some((line) => re.test(line));
      });
      if (matched_rule) {
        to_fix.push({ item, rule: matched_rule });
      } else {
        save([item]);
      }
    }

    if (to_fix.length === 0) {
      console.log("没有检测到需要修复的 JS 文件");
      return;
    }

    console.log("发现 " + to_fix.length + " 个文件需要修复");

    await using ai = await aiInit("使用工具修复 JS 代码");

    for (const {
      item: { file },
    } of to_fix) {
      const file_path = join(ROOT, file),
        fixed = await fixSingle(file_path, ai);
      if (fixed) {
        // 重新读取文件的最新状态并保存到缓存
        const new_code = read(file_path),
          { size, mtimeMs: mtime } = statSync(file_path),
          new_md5 = md5B64(new_code);

        save([
          {
            file,
            md5: new_md5,
            size,
            mtime,
          },
        ]);
        console.log("✓ 已完成修复并更新缓存: " + file);
      }
    }
  };

if (import.meta.main) {
  await main();
}

export default main;
