#!/usr/bin/env bun
import { basename, join } from "node:path";
import { readdirSync } from "node:fs";
import read from "@3-/read";
import R from "../lib/R.js";
import { R_USER_ID } from "./R/USER.js";
import { R_ORG_ID } from "./R/ORG.js";

const LIB_LUA = "lib.lua",
  luaLoad = async (dir) => {
    const rDir = join(dir, "R"),
      luaFiles = readdirSync(rDir).filter((file) => file.endsWith(".lua"));
    if (luaFiles.length > 0) {
      luaFiles.sort((a, b) => {
        if (a === LIB_LUA) return -1;
        if (b === LIB_LUA) return 1;
        return a.localeCompare(b);
      });
      const libName = basename(dir);
      let luaCode = "#!lua name=" + libName + "\n";
      for (const file of luaFiles) {
        luaCode += read(join(rDir, file)) + "\n";
      }
      await R.call("FUNCTION", "LOAD", "REPLACE", luaCode);
    }
  },
  main = async () => {
    // 用户ID用奇数，组织ID用偶数
    await R.pipeline().setnx(R_USER_ID, 100001).setnx(R_ORG_ID, 100000).exec();
    await luaLoad(import.meta.dirname);
  };

export default main;

if (import.meta.main) {
  await main();
}
