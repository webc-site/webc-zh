import { join } from "node:path";
import gitLs from "~/sh/lib/gitLs.js";
import cache from "~/ai/lib/cache/index.js";

const ROOT = join(import.meta.dirname, "../..");

export default async (ext_name, cache_name) => {
  const files = await gitLs("*." + ext_name, ROOT);
  if (cache_name) {
    return cache(cache_name, files);
  }
  return files;
};
