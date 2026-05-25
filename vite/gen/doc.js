import { join } from "node:path";
import { COM_DIR } from "~/vite/dist/comGen/const.js";
import genIndex from "~/vite/gen/doc/index.js";
import genDemo from "~/vite/gen/doc/demo.js";
import genReadme from "~/vite/gen/doc/readme.js";
import genX from "~/vite/gen/doc/x.js";

const docGen = (coms, meta) => {
  genIndex(meta);
  genDemo(coms);
  genReadme(join(COM_DIR, "..", "README.md"));
  genX(join(COM_DIR, "..", "x"));
};

export default docGen;
