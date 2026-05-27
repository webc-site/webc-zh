import { join, resolve } from "node:path";
import { readdirSync } from "node:fs";
import ROOT from "~/vite/const/ROOT.js";

export default (input) => {
  const com_dir = join(ROOT, "com"),
    parts = input.split("/"),
    comp_name = parts[parts.length - 1],
    comp_name_lower = comp_name.toLowerCase(),
    match = readdirSync(com_dir).find((d) => d.toLowerCase() === comp_name_lower),
    resolved_name = match || comp_name;

  return resolve(com_dir, resolved_name);
};
