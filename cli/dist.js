#!/usr/bin/env bun

import { writeFileSync, cpSync, rmSync, mkdtempSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { cd } from "@3-/zx";
import read from "@3-/read";

const bump = (version) => {
    const parts = version.split(".");
    parts[2] = String(Number(parts[2]) + 1);
    return parts.join(".");
  },
  publish = async (temp_dir) => {
    const pkg_path = join(import.meta.dirname, "package.json"),
      src_dir = join(import.meta.dirname, "src"),
      temp_pkg_path = join(temp_dir, "package.json");

    cpSync(pkg_path, temp_pkg_path);
    cpSync(src_dir, temp_dir, { recursive: true });

    const pkg = JSON.parse(read(temp_pkg_path));
    delete pkg.devDependencies;

    const content = JSON.stringify(pkg, null, 2)
      .replace(/"\.\/src\//g, '"./')
      .replace(/"src"/g, '"./"');
    writeFileSync(temp_pkg_path, content + "\n");

    cd(temp_dir);
    execSync("npm publish --access=public --registry=https://registry.npmjs.org/", {
      stdio: "inherit",
    });
  },
  main = async () => {
    const pkg_path = join(import.meta.dirname, "package.json"),
      pkg = JSON.parse(read(pkg_path));

    pkg.version = bump(pkg.version);
    writeFileSync(pkg_path, JSON.stringify(pkg, null, 2) + "\n");

    const temp_base = join(tmpdir(), "webc-add-"),
      temp_dir = mkdtempSync(temp_base);

    try {
      await publish(temp_dir);
    } finally {
      rmSync(temp_dir, { recursive: true, force: true });
    }
  };

if (import.meta.main) {
  await main();
}
