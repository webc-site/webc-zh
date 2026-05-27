#!/usr/bin/env bun
import yargs from "yargs/yargs";
import R from "../../lib/R.js";
import orgHost from "../../api/orgHost.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <org_id>").demandCommand(1).argv,
  org_id = Number(argv._[0]),
  main = async () => {
    try {
      const hosts = await orgHost(R, org_id);
      for (const host of hosts) {
        console.log(host);
      }
    } finally {
      await R.quit();
    }
  };

await main();
