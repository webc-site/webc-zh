import { join } from "node:path";
import write from "@3-/write";
import { GEN_DIR } from "~/vite/dist/comGen/const.js";
import jsMinify from "~/vite/dist/comGen/jsMinify.js";

const save = (path, val) => {
  write(join(GEN_DIR, "com", path), jsMinify("export default " + val + ";"));
};

export default save;
