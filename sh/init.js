#!/usr/bin/env bun

import font_init from "~/sh/init/font.js";
import package_init from "~/sh/init/package.js";

const init = async () => {
  await font_init();
  await package_init();
};

export default init;

if (import.meta.main) {
  await init();
}
