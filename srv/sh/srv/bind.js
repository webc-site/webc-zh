#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../src/conn/R.js";
import { R_SRV_NAME, R_HOST } from "../../src/R.js";
import u64Bin from "@3-/intbin/u64Bin.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <domain> <name>").demandCommand(2).argv,
  domain = argv._[0],
  name = argv._[1],
  main = async () => {
    const srv_id = await R.get(R_SRV_NAME(name));
    if (!srv_id) {
      ERR("绑定域名失败", "未找到服务 " + name);
      await R.quit();
      process.exit(1);
    }

    await R.set(R_HOST(domain), u64Bin(Number(srv_id)));
    console.log("成功绑定域名 " + domain + " 至服务 " + name + " (ID: " + srv_id + ")");
    await R.quit();
  };

await main();
