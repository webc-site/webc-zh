#!/usr/bin/env bun

import { $, cd } from "@3-/zx";
import pkg from "../../package.json";

$.verbose = 1;

const main = async () => {
  cd(import.meta.dirname);
  const args = process.argv.slice(2);
  await $`mise exec -- docker-compose -p ${pkg.name} down ${args}`;
};

export default main;

if (import.meta.main) {
  await main();
}
