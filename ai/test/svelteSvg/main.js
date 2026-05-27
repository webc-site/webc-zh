#!/usr/bin/env bun

import { join } from "node:path";
import { rm } from "node:fs/promises";
import write from "@3-/write";
import read from "@3-/read";
import aiInit from "~/ai/lib/ai.js";
import extractSvg from "~/ai/lib/svelteSvg/extract.js";

const DIR = import.meta.dirname,
  SVELTE_PATH = join(DIR, "Test.svelte"),
  SVG_DIR = join(DIR, "svg");

const main = async () => {
  try {
    write(
      SVELTE_PATH,
      "<style>\n" +
        "  .icon {\n" +
        "    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiAyMmgyMEwxMiAyeiIvPjwvc3ZnPg==');\n" +
        "  }\n" +
        "</style>\n",
    );
    console.log("创建临时测试 Svelte 文件: " + SVELTE_PATH);

    await using ai = await aiInit("提取 SVG 测试");
    await extractSvg(ai, SVELTE_PATH, SVG_DIR);

    console.log("\n更新后的 Test.svelte 内容:");
    console.log(read(SVELTE_PATH));
  } finally {
    await rm(SVELTE_PATH, { force: true });
    await rm(SVG_DIR, { recursive: true, force: true });
    console.log("清理临时测试文件与目录完成。");
  }
};

await main();
