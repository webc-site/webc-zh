#!/usr/bin/env bun
import yargs from "yargs/yargs";
import R from "../../lib/R.js";
import userOrg from "../../api/userOrg.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <uid>").demandCommand(1).argv,
  uid = Number(argv._[0]),
  main = async () => {
    try {
      const org_ids = await userOrg(R, uid);
      for (const org_id of org_ids) {
        console.log(org_id);
      }
    } finally {
      await R.quit();
    }
  };

await main();
