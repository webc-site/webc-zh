#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { join } from "node:path";
import { $ } from "@3-/zx";
import ROOT from "~/vite/const/ROOT.js";

$.verbose = 1;

const init = async () => {
  const font_dir = join(ROOT, "font");
  if (!existsSync(font_dir)) {
    const url = (await $(["git remote get-url origin"])).toString().trim(),
      last_slash = url.lastIndexOf("/"),
      font_url = url.slice(0, last_slash + 1) + "font.git";
    await $(["git clone --depth=1 " + font_url + " " + font_dir]);
    await $(["git -C " + font_dir + " lfs pull"]);
  }
};

export default init;

if (import.meta.main) {
  await init();
}
