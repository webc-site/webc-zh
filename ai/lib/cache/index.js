import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import md5B64 from "@3-/base64url/md5B64.js";
import { CACHE_DIR, TMP_DIR } from "~/ai/lib/cache/dir.js";
import load from "~/ai/lib/cache/load.js";
import save from "~/ai/lib/cache/save.js";

export default (name, files, toTarget) => {
  const cache_yml_path = join(CACHE_DIR, name + ".yml"),
    tmp_msgpack_path = join(TMP_DIR, name + ".msgpack"),
    [cache_yml, cache_msgpack] = load(cache_yml_path, tmp_msgpack_path),
    next_cache_msgpack = { ...cache_msgpack },
    next_cache_yml = { ...cache_yml },
    changed = [];

  for (const file of files) {
    if (!existsSync(file)) continue;
    const { size, mtimeMs: mtime } = statSync(file),
      cached_stat = cache_msgpack[file],
      target_path = toTarget ? toTarget(file) : null,
      target_ok = !target_path || existsSync(target_path);

    if (cached_stat && cached_stat[0] === size && cached_stat[1] === mtime && target_ok) {
      continue;
    }

    const code = read(file),
      md5 = md5B64(code);

    if (cache_yml[file] === md5 && target_ok) {
      next_cache_msgpack[file] = [size, mtime];
      continue;
    }

    changed.push({
      file,
      code,
      md5,
      size,
      mtime,
    });
  }

  const saveCache = (processed_files) => {
    for (const item of processed_files) {
      next_cache_yml[item.file] = item.md5;
      next_cache_msgpack[item.file] = [item.size, item.mtime];
    }
    save(cache_yml_path, tmp_msgpack_path, next_cache_yml, next_cache_msgpack);
  };

  return [changed, saveCache];
};
