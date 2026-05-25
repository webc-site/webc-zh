#!/usr/bin/env bun

import { $ } from "zx";
import gci from "~/ai/lib/gci.js";

const main = async () => {
  const branch_name = (await $`git branch --show-current`).toString().trim();

  if (branch_name !== "main") {
    const has_uncommitted = (await $`git status --porcelain`).toString().trim();
    if (has_uncommitted) {
      await gci();
    }

    await $`git checkout main`;
    await $`git merge ${branch_name}`;
    await $`git push origin main`;
    await $`git checkout ${branch_name}`;
  }
};

await main();
