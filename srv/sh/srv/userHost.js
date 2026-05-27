#!/usr/bin/env bun
import yargs from "yargs/yargs";
import R from "../../src/conn/R.js";
import userHost from "../../api/userHost.js";

const argv = yargs(process.argv.slice(2)).usage("Usage: $0 <uid>").demandCommand(1).argv,
  uid = Number(argv._[0]),
  main = async () => {
    try {
      const hosts = await userHost(R, uid);
      for (const host of hosts) {
        console.log(host);
      }
    } finally {
      await R.quit();
    }
  };

await main();
