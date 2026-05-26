#!/usr/bin/env bun

import { $ } from "zx";
import gci from "~/ai/lib/gci.js";

$.verbose = 1;

const main = async () => {
  const branch_name = (await $`git branch --show-current`).toString().trim();

  if (branch_name !== "main") {
    const has_uncommitted = (await $`git status --porcelain`).toString().trim();
    if (has_uncommitted) {
      await gci();
    }

    await $`git checkout main`;
    await $`git pull`;
    await $`git merge ${branch_name}`;
    await $`git push origin main`;
    await $`git checkout ${branch_name}`;
    await $`git merge main`;
    await $`git push`;
  }
};

await main();
