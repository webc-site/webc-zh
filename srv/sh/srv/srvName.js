#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import srvName from "../../api/srvName.js";
import { SRV_NOT_FOUND } from "../../api/ERR.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <srv_id>").demandCommand(1).argv,
  srv_id = Number(argv._[0]),
  main = async () => {
    try {
      const name = await srvName(R, srv_id);
      console.log(name);
    } catch (err) {
      if (err === SRV_NOT_FOUND) {
        ERR("查询失败", "未找到服务 ID " + srv_id);
      } else {
        ERR("查询失败", err.message || err);
      }
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
