#!/usr/bin/env bun
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import ai from "~/ai/lib/ai.js";
import cache from "~/ai/lib/cache/index.js";

import parse from "~/ai/xDoc/parse.js";
import schema from "~/ai/xDoc/schema.js";
import ask from "~/ai/xDoc/ask.js";
import render from "~/ai/xDoc/render.js";

const ROOT_DIR = dirname(import.meta.dirname),
  X_DIR = join(ROOT_DIR, "x");

const main = async () => {
  const files = readdirSync(X_DIR),
    js_files = files
      .filter((f) => f.endsWith(".js") && f !== "package.json")
      .map((f) => join("x", f)),
    toTarget = (js_path) => js_path.replace(/\.js$/, ".md"),
    [changed, save] = cache("xDoc", js_files, toTarget);

  if (changed.length === 0) {
    console.log("没有检测到文档更新");
    return;
  }

  console.log("共有 " + changed.length + " 个文件待更新文档...");
  console.log("待更新文件: " + changed.map((p) => p.file.split("/").pop()).join(", "));

  for (const item of changed) {
    const { file, code } = item,
      file_name = file.split("/").pop(),
      md_path = toTarget(file);

    console.log("\n正在为 " + file_name + " 生成文档...");
    let existing_doc = "";
    if (existsSync(md_path)) {
      existing_doc = read(md_path);
    }

    const exports_list = parse(code, file_name),
      schema_obj = schema(exports_list);

    await using runAi = await ai("生成 x/" + file_name + " 的文档");
    const reply_json = await ask(runAi, item, schema_obj, existing_doc);
    if (!reply_json) {
      throw new Error("处理文件 " + file_name + " 失败，AI 校验不通过");
    }

    const rendered_md = render(reply_json, exports_list);
    write(md_path, rendered_md);
    console.log("✓ 成功生成文档: " + file_name.replace(/\.js$/, ".md"));

    save([item]);
  }

  console.log("\n缓存更新完毕");
};

try {
  await main();
} catch (err) {
  console.error("执行出错:", err);
  process.exit(1);
}
