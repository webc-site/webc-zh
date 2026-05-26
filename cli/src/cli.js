#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import resolve from "./resolve.js";
import { cache, download } from "./download.js";
import NAME from "./const/NAME.js";
import compile from "./compile.js";
import GREEN from "@3-/log/GREEN.js";
import pkgMerge from "./pkgMerge.js";
import pkgFind from "./pkgFind.js";

const { version: CLI_VERSION } = JSON.parse(read(join(import.meta.dirname, "../package.json"))),
  exit = (msg) => {
    console.error(msg);
    process.exit(1);
  },
  parse = () => {
    const argv = yargs(hideBin(process.argv))
        .usage("Usage: $0 <component-name>")
        .version(CLI_VERSION)
        .alias("v", "version")
        .help()
        .alias("h", "help").argv,
      {
        _: [name],
      } = argv;

    if (!name) {
      exit("Please provide a component name");
    }
    return name;
  },
  prepare = async () => {
    const metadata = await resolve();
    if (!metadata) {
      exit("Failed to fetch " + NAME + " metadata from npm registries");
    }
    const [version, url] = metadata,
      dir = cache(version);

    GREEN(NAME + "@" + version);

    if (!existsSync(dir)) {
      await download(url, dir);
    }
    return dir;
  },
  merge = async (dir, root) => {
    const pkg_path = join(dir, "package.json");
    if (existsSync(pkg_path)) {
      const { dependencies } = JSON.parse(read(pkg_path));
      if (dependencies) {
        await pkgMerge(dependencies, root);
      }
    }
  },
  build = async (dir, name, root) => {
    const index_js = join(dir, "index.js");
    if (!existsSync(index_js)) {
      exit("index.js not found in package");
    }

    const { default: list } = await import(pathToFileURL(index_js).href);

    if (!Array.isArray(list)) {
      exit("Invalid components list");
    }

    const canonical_name = list.find((item) => item.toLowerCase() === name.toLowerCase());
    if (!canonical_name) {
      exit("Component " + name + " does not exist");
    }

    const com_pkg_path = join(dir, canonical_name, "package.json");
    if (existsSync(com_pkg_path)) {
      const { dependencies } = JSON.parse(read(com_pkg_path));
      if (dependencies) {
        await pkgMerge(dependencies, root);
      }
    }

    compile(dir, canonical_name);
  },
  main = async () => {
    const name = parse(),
      root = dirname(pkgFind(process.cwd())),
      dir = await prepare();
    await merge(dir, root);
    await build(dir, name, root);
  };

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
