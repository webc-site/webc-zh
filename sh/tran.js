#!/usr/bin/env bun

import { existsSync } from "node:fs";
import read from "@3-/read";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { load } from "js-yaml";
import CODE from "@3-/lang/CODE.js";
import alitran from "@3-/alitran";
import codeIdx from "~/sh/tran/codeIdx.js";
import tran from "~/sh/tran/tran.js";

const ROOT = dirname(import.meta.dirname),
  main = async () => {
    const token_path = join(homedir(), ".config/webc.site/ALI_TOKEN.js");
    if (!existsSync(token_path)) {
      console.warn("⚠️ " + token_path + " 不存在");
      return;
    }
    const ali_tran = alitran((await import(token_path)).default),
      conf_path = join(ROOT, "conf/i18n.yml"),
      conf = load(read(conf_path)),
      { from, to } = conf,
      to_arr = to === "*" ? CODE : to.split(" "),
      from_idx = codeIdx(from),
      to_li = to_arr.map(codeIdx).filter((idx) => idx !== -1);

    await tran(ROOT, ali_tran, from_idx, to_li);
  };

export default main;

if (import.meta.main) {
  await main();
}
