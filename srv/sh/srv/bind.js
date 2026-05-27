#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import srvHostBind from "../../api/srvHostBind.js";
import { SRV_NOT_FOUND } from "../../api/ERR.js";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 <org_id> <domain> <name>")
    .demandCommand(3).argv,
  org_id = Number(argv._[0]),
  domain = argv._[1],
  name = argv._[2],
  main = async () => {
    try {
      const srv_id = await srvHostBind(R, org_id, domain, name);
      console.log("成功绑定域名 " + domain + " 至服务 " + name + " (ID: " + srv_id + ")");
    } catch (err) {
      if (err === SRV_NOT_FOUND) {
        ERR("绑定域名失败", "未找到服务 " + name);
      } else {
        ERR("绑定域名失败", err.message || err);
      }
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
