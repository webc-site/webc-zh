#!/usr/bin/env bun

import { $, cd } from "@3-/zx";
import pkg from "../../package.json";

$.verbose = 1;

const main = async () => {
  cd(import.meta.dirname);
  const running = await $({
    quiet: true,
  })`docker compose -p ${pkg.name} ps --filter status=running --format json`;
  if (running.toString().trim()) {
    console.log(`${pkg.name} is already running.`);
    return;
  }
  const args = process.argv.slice(2);
  if (args.length === 0) {
    args.push("-d");
  }

  await $`docker compose -p ${pkg.name} up ${args}`;
};

export default main;

if (import.meta.main) {
  await main();
}
