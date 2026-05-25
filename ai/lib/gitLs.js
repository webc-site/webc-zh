import { globby } from "globby";
import cache from "~/ai/lib/cache/index.js";

export default async (ext_name, cache_name) => {
  const files = await globby(["**/*." + ext_name], {
    gitignore: true,
  });
  if (cache_name) {
    return cache(cache_name, files);
  }
  return files;
};
