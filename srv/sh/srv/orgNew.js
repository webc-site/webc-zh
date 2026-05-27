#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import orgNew from "../../api/orgNew.js";
import { ORG_EXIST } from "../../api/ERR.js";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 <user_id> <org_name>")
    .demandCommand(2).argv,
  user_id = Number(argv._[0]),
  org_name = argv._[1],
  main = async () => {
    try {
      const id = await orgNew(R, user_id, org_name);
      console.log(id);
    } catch (err) {
      if (Array.isArray(err) && err[0] === ORG_EXIST) {
        ERR("创建组织失败", "组织名 " + org_name + " 已存在，ID: " + err[1]);
      } else {
        ERR("创建组织失败", err.message || err);
      }
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
