import { readdirSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";

const clean = (dir) => {
  const files = readdirSync(dir);
  if (files.length === 0) {
    rmSync(dir, { recursive: true, force: true });
    return true;
  }
  let all_empty = true;
  for (const file of files) {
    const full_path = join(dir, file);
    if (statSync(full_path).isDirectory()) {
      if (!clean(full_path)) {
        all_empty = false;
      }
    } else {
      all_empty = false;
    }
  }
  if (all_empty) {
    rmSync(dir, { recursive: true, force: true });
    return true;
  }
  return false;
};

export default clean;
