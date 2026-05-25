#!/usr/bin/env bun

import { dirname, join } from "node:path";
import aiInit from "~/ai/lib/ai.js";
import gitLs from "~/ai/lib/gitLs.js";
import extractSvg from "~/ai/lib/svelteSvg/extract.js";

const ROOT = dirname(import.meta.dirname),
  SVG_DIR = join(ROOT, "public", "svg");

const main = async () => {
  const [changed, save] = await gitLs("svelte", "svelteSvg");

  if (changed.length === 0) {
    console.log("没有检测到需要处理的 Svelte 文件。");
    return;
  }

  await using ai = await aiInit("提取 SVG");
  for (const item of changed) {
    await extractSvg(ai, join(ROOT, item.file), SVG_DIR);
    save([item]);
  }
};

export default main;

if (import.meta.main) {
  await main();
}
