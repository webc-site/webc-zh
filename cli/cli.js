#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import resolve from "./resolve.js";
import { cache, download } from "./download.js";
import NAME from "./const/NAME.js";
import compile from "./compile.js";
import GREEN from "@3-/log/GREEN.js";

const { version: CLI_VERSION } = JSON.parse(read(join(import.meta.dirname, "package.json")));

const main = async () => {
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
    console.error("Please provide a component name");
    process.exit(1);
  }

  const metadata = await resolve();
  if (!metadata) {
    console.error("Failed to fetch " + NAME + " metadata from npm registries");
    process.exit(1);
  }
  const [version, url] = metadata,
    dir = cache(version);

  GREEN(NAME + "@" + version);

  if (!existsSync(dir)) {
    await download(url, dir);
  }

  const index_js = join(dir, "index.js");
  if (!existsSync(index_js)) {
    console.error("index.js not found in package");
    process.exit(1);
  }

  const { default: list } = await import(pathToFileURL(index_js).href);

  if (!Array.isArray(list)) {
    console.error("Invalid components list");
    process.exit(1);
  }

  const canonical_name = list.find((item) => item.toLowerCase() === name.toLowerCase());
  if (!canonical_name) {
    console.error("Component " + name + " does not exist");
    process.exit(1);
  }

  compile(dir, canonical_name);
};

try {
  await main();
} catch ({ message }) {
  console.error(message);
  process.exit(1);
}
