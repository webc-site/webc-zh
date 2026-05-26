import { join, dirname } from "node:path";
import { homedir } from "node:os";
import NAME from "./NAME.js";
import pkgFind from "../pkgFind.js";

const home = homedir(),
  base =
    process.platform === "win32"
      ? process.env.LOCALAPPDATA || join(home, "AppData", "Local")
      : join(home, ".cache");

export const ROOT = dirname(pkgFind(process.cwd())),
  LIB = join(ROOT, "lib"),
  CSS = join(LIB, "css"),
  PUBLIC = join(ROOT, "public"),
  CACHE = join(base, NAME);
