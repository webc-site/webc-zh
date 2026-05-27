#!/usr/bin/env bun
import yargs from "yargs/yargs";
import ERR from "@3-/log/ERR.js";
import R from "../../lib/R.js";
import userNewByMail from "../../api/userNewByMail.js";
import { MAIL_EXIST } from "../../api/ERR.js";

const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 <username> <email>")
    .demandCommand(2).argv,
  username = argv._[0],
  email = argv._[1],
  main = async () => {
    try {
      const id = await userNewByMail(R, username, email);
      console.log(id);
    } catch (err) {
      if (Array.isArray(err) && err[0] === MAIL_EXIST) {
        ERR("创建用户失败", "邮箱 " + email + " 已存在，用户ID: " + err[1]);
      } else {
        ERR("创建用户失败", err.message || err);
      }
      process.exit(1);
    } finally {
      await R.quit();
    }
  };

await main();
