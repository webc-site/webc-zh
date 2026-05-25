#!/usr/bin/env bun

import { existsSync, statSync, createReadStream } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { createServer } from "vite";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import ext from "@3-/ext";
import configForCom from "~/vite/com/vite.config.js";

const CONTENT_TYPE = "Content-Type",
  MIME_TYPE = {
    svg: "image/svg+xml",
    js: "application/javascript",
    css: "text/css",
  },
  argv = yargs(hideBin(process.argv)).argv,
  port = argv.port || 5182;
let input_path = argv._[0];

if (!input_path) {
  console.error("Please provide a component name or folder path");
  process.exit(1);
}

if (!input_path.startsWith("com/") && !input_path.startsWith("./com/")) {
  input_path = join("com", input_path);
}

const root = dirname(dirname(import.meta.dirname)),
  absolute_path = resolve(input_path),
  comp_name = basename(absolute_path),
  svelte_file = join(absolute_path, "Demo.svelte");

if (!existsSync(absolute_path) || !statSync(absolute_path).isDirectory()) {
  console.error("Invalid folder path: " + input_path);
  process.exit(1);
}

if (!existsSync(svelte_file)) {
  console.error("Corresponding Svelte component not found: " + svelte_file);
  process.exit(1);
}

try {
  const config = configForCom(comp_name, root, false);
  config.server = {
    host: true,
    port,
  };

  const server = await createServer(config);

  server.middlewares.use((req, res, next) => {
    const url = req.url.split("?")[0];

    if (url.startsWith("/com/")) {
      const file_path = join(root, "public", url);
      if (existsSync(file_path)) {
        res.statusCode = 200;
        const mime = MIME_TYPE[ext(url)];
        if (mime) {
          res.setHeader(CONTENT_TYPE, mime);
        }
        createReadStream(file_path).pipe(res);
        return;
      }
    }
    next();
  });

  await server.listen();
  server.printUrls();
} catch (err) {
  console.error("Error starting dev server:", err);
  process.exit(1);
}
