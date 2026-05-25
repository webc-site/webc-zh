import { join } from "node:path";
import { homedir } from "node:os";
import NAME from "./NAME.js";

const root = process.cwd(),
  home = homedir(),
  base =
    process.platform === "win32"
      ? process.env.LOCALAPPDATA || join(home, "AppData", "Local")
      : join(home, ".cache");

export const ROOT = root,
  LIB = join(root, "lib"),
  CSS = join(LIB, "css"),
  PUBLIC = join(root, "public"),
  CACHE = join(base, NAME);
