#!/usr/bin/env bun

import read from "@3-/read";
import { dirname, join } from "node:path";
import { load } from "js-yaml";
import CODE from "@3-/lang/CODE.js";

const ROOT = dirname(import.meta.dirname),
  main = async () => {
    const conf_path = join(ROOT, "conf/i18n.yml"),
      conf = load(read(conf_path)),
      { from, to } = conf,
      to_arr = to === "*" ? CODE : to.split(" "),
      to_li = [];

    for (const name of to_arr) {
      const idx = CODE.indexOf(name);
      if (idx === -1) {
        console.warn("⚠️ " + name + " 不存在");
      } else {
        to_li.push(idx);
      }
    }

    console.log({ from, to_li });
  };

export default main;

if (import.meta.main) {
  await main();
}
