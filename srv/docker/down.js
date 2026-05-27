#!/usr/bin/env bun

import { $ } from "@3-/zx";
import pkg from "~/package.json";

$.verbose = 1;

process.chdir(import.meta.dirname);

const args = process.argv.slice(2);

await $`mise exec -- docker-compose -p ${pkg.name} down ${args}`;
