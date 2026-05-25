import stylus from "stylus";
import { join } from "node:path";
import { ROOT } from "../const/DIR.js";

export default (content, file_path) =>
  stylus(content).set("filename", file_path).include(join(ROOT, "node_modules")).render();
