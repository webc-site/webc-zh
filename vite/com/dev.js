#!/usr/bin/env bun

import { existsSync, statSync, createReadStream } from "node:fs";
import { join, basename, dirname } from "node:path";
import { createServer } from "vite";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import ext from "@3-/ext";
import configForCom from "~/vite/com/vite.config.js";
import com from "~/sh/lib/com.js";

const CONTENT_TYPE = "Content-Type",
  MIME_TYPE = {
    svg: "image/svg+xml",
    js: "application/javascript",
    css: "text/css",
  },
  check = (path) => {
    if (!existsSync(path) || !statSync(path).isDirectory()) {
      console.error("Invalid folder path: " + path);
      process.exit(1);
    }
    if (!existsSync(join(path, "Demo.svelte"))) {
      console.error("Corresponding Svelte component not found: " + join(path, "Demo.svelte"));
      process.exit(1);
    }
  },
  serve = (root, req, res, next) => {
    const url = req.url.split("?")[0];
    if (url.toLowerCase().startsWith("/com/")) {
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
  },
  main = async () => {
    const argv = yargs(hideBin(process.argv)).argv,
      port = argv.port || 5182,
      input_path = argv._[0];

    if (!input_path) {
      console.error("Please provide a component name or folder path");
      process.exit(1);
    }

    const absolute_path = com(input_path),
      root = dirname(dirname(import.meta.dirname)),
      comp_name = basename(absolute_path);

    check(absolute_path);

    try {
      const config = configForCom(comp_name, root, false);
      config.server = {
        host: true,
        port,
      };

      const server = await createServer(config);
      server.middlewares.use(serve.bind(null, root));

      await server.listen();
      server.printUrls();
    } catch (err) {
      console.error("Error starting dev server:", err);
      process.exit(1);
    }
  };

if (import.meta.main) {
  await main();
}
