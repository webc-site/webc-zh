#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import srvJsSet from "../../api/srvJsSet.js";
import read from "@3-/read";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 <srv_id> <path> <file_path> [compatibility_date]")
    .demandCommand(3).argv,
  srv_id = Number(argv._[0]),
  path = argv._[1],
  file_path = argv._[2],
  compatibility_date = argv._[3],
  main = async () => {
    try {
      const code = read(file_path);
      await srvJsSet(R, srv_id, path, code, compatibility_date);
      console.log("成功为服务 " + srv_id + " 的路径 " + path + " 设置脚本");
    } catch (err) {
      ERR("设置路径脚本失败", err.message || err);
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
