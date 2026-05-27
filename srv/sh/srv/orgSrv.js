#!/usr/bin/env bun
import yargs from "yargs/yargs";
import R from "../../lib/R.js";
import orgSrv from "../../api/orgSrv.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <org_id>").demandCommand(1).argv,
  org_id = Number(argv._[0]),
  main = async () => {
    try {
      const srvs = await orgSrv(R, org_id);
      for (const [id, name] of srvs) {
        console.log(id + "\t" + name);
      }
    } finally {
      await R.quit();
    }
  };

await main();
