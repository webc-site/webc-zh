import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";

const ROOT_DIR = dirname(dirname(dirname(import.meta.dirname)));

export const CACHE_DIR = join(ROOT_DIR, ".cache"),
  TMP_DIR = join(ROOT_DIR, ".tmp");

mkdirSync(CACHE_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });
