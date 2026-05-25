import { existsSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import { COM_DIR } from "~/vite/dist/comGen/const.js";
import save from "~/vite/gen/doc/save.js";

const genDemo = (coms) => {
  const demos = [];
  for (const name of coms) {
    const dir = join(COM_DIR, name, "demo"),
      paths = ["_.htm", "_.js", "_.css"].map((file) => join(dir, file));
    if (paths.every(existsSync)) {
      demos.push([name, paths.map(read)]);
    }
  }
  save("demo/index.js", JSON.stringify(demos));
};

export default genDemo;
