#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import srvNew from "../../api/srvNew.js";
import { SRV_EXIST } from "../../api/ERR.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <org_id> <name>").demandCommand(2).argv,
  org_id = Number(argv._[0]),
  name = argv._[1],
  main = async () => {
    try {
      const id = await srvNew(R, org_id, name);
      console.log(id);
    } catch (err) {
      if (Array.isArray(err) && err[0] === SRV_EXIST) {
        ERR("创建服务失败", "服务名 " + name + " 已存在，ID: " + err[1]);
      } else {
        ERR("创建服务失败", err.message || err);
      }
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
