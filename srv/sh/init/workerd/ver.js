import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { BIN_PATH } from "./env.js";

export default () => {
  if (!existsSync(BIN_PATH)) return null;
  const res = spawnSync(BIN_PATH, ["--version"], { encoding: "utf8" });
  if (res.error) return null;
  return res.stdout.match(/workerd\s+(\d{4}-\d{2}-\d{2})/)?.[1] || null;
};
