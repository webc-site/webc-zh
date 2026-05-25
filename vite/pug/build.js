import extract_replace_include from "@3-/extract/extractReplaceInclude.js";
import pug2htm from "~/vite/pug/toHtm.js";
import pug_hack from "~/vite/pug/hack.js";
import { join } from "path";
import fs from "fs";
import conf from "~/conf/pug.js";

const dir_name = import.meta.dirname,
  site_dir = join(dir_name, "..", "..");

const render = (content, filename, dir, locals) =>
  pug2htm(
    pug_hack(content),
    filename,
    Object.assign({ basedir: join(dir, "pug") }, conf, locals),
  )[0].replace(/="\{([^"]*)\}"/g, "={$1}");

export const gen = (pug_file, locals) => {
  const content = fs.readFileSync(pug_file, "utf8");
  return render(content, pug_file, site_dir, locals);
};

export default (dir) => {
  return {
    markup: (o) => {
      const code = extract_replace_include(
        '<template lang="pug">',
        "</template>",
        (pug) => "\n" + render(pug.slice(21, -11), o.filename, dir),
        o.content,
      );
      if (code) {
        return {
          code,
          map: {
            version: 3,
            file: o.filename,
            sources: [o.filename],
            sourcesContent: [o.content],
            names: [],
            mappings: "",
          },
        };
      }
    },
  };
};
