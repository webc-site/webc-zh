#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../src/conn/R.js";
import srvHost from "../../api/srvHost.js";
import { SRV_NOT_FOUND } from "../../api/ERR.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <name>").demandCommand(1).argv,
  name = argv._[0],
  main = async () => {
    try {
      const hosts = await srvHost(R, name);
      for (const host of hosts) {
        console.log(host);
      }
    } catch (err) {
      if (err === SRV_NOT_FOUND) {
        ERR("查询失败", "未找到服务 " + name);
      } else {
        ERR("查询失败", err.message || err);
      }
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
