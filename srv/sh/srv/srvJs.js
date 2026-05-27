#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import srvJsList from "../../api/srvJsList.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <srv_id>").demandCommand(1).argv,
  srv_id = Number(argv._[0]),
  main = async () => {
    try {
      const paths = await srvJsList(R, srv_id);
      for (const path of paths) {
        console.log(path);
      }
    } catch (err) {
      ERR("查询服务路径失败", err.message || err);
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
