#!/usr/bin/env bun
import { build } from "rolldown";
import { esmExternalRequirePlugin } from "rolldown/plugins";
import { join } from "node:path";
import { builtinModules } from "node:module";
import SRV from "./const/SRV.js";

const input = join(SRV, "lib/main.js"),
  output = join(SRV, "dist/main.js"),
  ext = builtinModules.filter((b) => !b.startsWith("_")).flatMap((b) => [b, "node:" + b]);

await build({
  input,
  output: {
    file: output,
    format: "esm",
  },
  plugins: [
    esmExternalRequirePlugin({
      external: ext,
    }),
  ],
});
