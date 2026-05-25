import { readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import stylRender from "~/vite/stylus.js";
import { transform } from "lightningcss";
import read from "@3-/read";
import write from "@3-/write";
import ROOT from "~/vite/const/ROOT.js";
import { replace } from "vite-plugin-svg-var";

const STYL_DIR = join(ROOT, "styl"),
  OUT_FILE = join(ROOT, "public/_.css"),
  RESET_STYL = "reset.styl",
  compileStylus = (is_build) => {
    const files = readdirSync(STYL_DIR)
      .filter((file) => file.endsWith(".styl"))
      .sort((a, b) => {
        if (a === RESET_STYL) return -1;
        if (b === RESET_STYL) return 1;
        return a.localeCompare(b);
      });
    let css = files
      .map((file) => {
        const file_path = join(STYL_DIR, file),
          real_path = realpathSync(file_path),
          content = read(real_path);
        return stylRender(content, real_path);
      })
      .join("\n");

    css = replace(css);

    if (is_build) {
      const { code } = transform({
        filename: "_.css",
        code: Buffer.from(css),
        minify: true,
        sourceMap: false,
      });
      css = code.toString();
    }

    write(OUT_FILE, css);
  };

export default (is_build) => ({
  name: "stylus-pack",
  buildStart: () => {
    compileStylus(is_build);
  },
  configureServer: (server) => {
    server.watcher.add(STYL_DIR);
    server.watcher.on("all", (event, file) => {
      if (file.endsWith(".styl")) {
        compileStylus(is_build);
        server.ws.send({ type: "full-reload" });
      }
    });
  },
});
