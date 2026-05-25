#!/usr/bin/env bun

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import main from "~/sh/dist/com.js";
import { LIB_DIR, COM_DIR, GEN_DIR } from "~/vite/dist/comGen/const.js";
import docGen from "~/vite/gen/doc.js";
import { extract as extractSvgs } from "~/cli/compile/svg.js";
import jsMinify from "~/vite/dist/comGen/jsMinify.js";

const CSS = ".css",
  JS = ".js",
  STYL = ".styl",
  metadata = (name) => {
    const com_path = join(COM_DIR, name),
      readme_path = join(com_path, "i18n/zh/README.md"),
      demo_path = join(com_path, "Demo.svelte"),
      com_js = join(com_path, name + JS);

    if (existsSync(readme_path) && existsSync(demo_path)) {
      const readme = read(readme_path),
        lines = readme.split("\n"),
        first_line = (lines[0] || "").replace(/^#\s*/, "").trim(),
        doc_readme = lines.slice(1).join("\n").trim(),
        svgs = extractSvgs(com_path),
        cdn_files = [],
        styl_files = readdirSync(com_path).filter(
          (file) => file.endsWith(STYL) && statSync(join(com_path, file)).isFile(),
        );

      if (existsSync(com_js)) {
        cdn_files.push(name + JS);
      }
      if (styl_files.length > 0) {
        cdn_files.push(name + CSS);
      }

      const doc_js = [
        "export default [",
        "  " + JSON.stringify(doc_readme) + ",",
        '  () => import("../../../com/' + name + '/Demo.svelte"),',
        "  " + JSON.stringify(svgs) + ",",
        "  " + JSON.stringify(cdn_files),
        "];",
      ].join("\n");
      write(join(GEN_DIR, "com", "md", name + JS), jsMinify(doc_js));
      return [name, first_line, '() => import("./md/' + name + '.js")'];
    }
    return null;
  },
  run = async () => {
    const [coms] = await main(LIB_DIR),
      coms_metadata = [];
    for (const name of coms) {
      const meta = metadata(name);
      if (meta) {
        coms_metadata.push(meta);
      }
    }
    docGen(coms, coms_metadata);
  };

export default run;

if (import.meta.main) {
  await run();
}
