#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../src/conn/R.js";
import { R_SRV_NAME, R_SRV_ID_INCR } from "../../src/R.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <name>").demandCommand(1).argv,
  name = argv._[0],
  main = async () => {
    const exist = await R.get(R_SRV_NAME(name));
    if (exist) {
      ERR("创建服务失败", "服务名 " + name + " 已存在，ID: " + exist);
      await R.quit();
      process.exit(1);
    }

    const id = await R.incr(R_SRV_ID_INCR);
    await R.set(R_SRV_NAME(name), id);
    console.log(id);
    await R.quit();
  };

await main();
