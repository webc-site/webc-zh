import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import ROOT from "~/vite/const/ROOT.js";
import genIco from "~/vite/ico/gen.js";

export default () => ({
  name: "ico-gen",
  buildStart: async () => {
    const ico_path = join(ROOT, "public/favicon.ico"),
      svg_path = join(ROOT, "public/svg/site.svg");

    let should_gen = !existsSync(ico_path);
    if (!should_gen && existsSync(svg_path)) {
      should_gen = statSync(svg_path).mtimeMs > statSync(ico_path).mtimeMs;
    }

    if (should_gen) {
      await genIco();
    }
  },
});
