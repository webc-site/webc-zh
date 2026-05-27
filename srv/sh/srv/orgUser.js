#!/usr/bin/env bun
import yargs from "yargs/yargs";
import R from "../../lib/R.js";
import orgUser from "../../api/orgUser.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <org_id>").demandCommand(1).argv,
  org_id = Number(argv._[0]),
  main = async () => {
    try {
      const users = await orgUser(R, org_id);
      for (const [uid, role] of users) {
        console.log(uid + "\t" + role);
      }
    } finally {
      await R.quit();
    }
  };

await main();
