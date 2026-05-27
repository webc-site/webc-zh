#!/usr/bin/env bun

import { $ } from "@3-/zx";
import pkg from "~/package.json";

process.chdir(import.meta.dirname);

const running = await $({
  quiet: true,
})`docker compose -p ${pkg.name} ps --filter status=running --format json`;

if (running.toString().trim()) {
  console.log(`${pkg.name} is already running.`);
  process.exit(0);
}

$.verbose = 1;

const args = process.argv.slice(2);
if (args.length === 0) {
  args.push("-d");
}

await $`docker compose -p ${pkg.name} up ${args}`;
