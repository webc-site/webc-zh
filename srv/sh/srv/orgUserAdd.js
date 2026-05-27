#!/usr/bin/env bun
import yargs from "yargs/yargs";
import R from "../../lib/R.js";
import orgUserAdd from "../../api/orgUserAdd.js";
import * as ORG_USER_ROLE from "../../api/const/ORG_USER_ROLE.js";
import ERR from "@3-/log/ERR.js";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 <org_id> <uid> <role>")
    .demandCommand(3).argv,
  org_id = Number(argv._[0]),
  uid = Number(argv._[1]),
  role_str = argv._[2].toString(),
  main = async () => {
    try {
      const role_map = {};
      for (const [k, v] of Object.entries(ORG_USER_ROLE)) {
        role_map[k.toLowerCase()] = v;
      }

      let role = role_map[role_str.toLowerCase()];
      if (role === undefined) {
        const num = Number(role_str);
        if (!isNaN(num) && Object.values(ORG_USER_ROLE).includes(num)) {
          role = num;
        }
      }

      if (role === undefined) {
        ERR("未知身份角色: " + role_str);
        console.error(
          "可用角色: " +
            Object.keys(ORG_USER_ROLE).join(", ").toLowerCase() +
            " 或其对应数字 (" +
            Object.values(ORG_USER_ROLE).join(", ") +
            ")",
        );
        process.exit(1);
      }

      await orgUserAdd(R, org_id, uid, role);
      console.log(`成功将用户 ${uid} 以角色 ${role} 添加到组织 ${org_id}`);
    } catch (err) {
      ERR("添加用户到组织失败", err.message || err);
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
