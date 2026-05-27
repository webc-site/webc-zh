import { existsSync } from "node:fs";
import read from "@3-/read";
import write from "@3-/write";
import { join } from "node:path";
import { load, dump } from "js-yaml";
import CODE from "@3-/lang/CODE.js";
import scan from "~/sh/tran/scan.js";
import tranVal from "~/sh/tran/tranVal.js";
import cacheVal from "~/sh/tran/cache.js";

export default async (ROOT, ali_tran, from_idx, to_li) => {
  const from_lang = CODE[from_idx],
    files = scan(ROOT, from_lang);

  for (const [i18n_dir, yml_file, yml_path] of files) {
    const src_data = load(read(yml_path));
    if (!src_data) {
      continue;
    }

    const cache_path = join(i18n_dir, ".cache", from_lang, yml_file),
      cache_data = existsSync(cache_path) ? load(read(cache_path)) : {},
      new_cache_data = cacheVal(src_data);

    for (const to_idx of to_li) {
      const to_lang = CODE[to_idx];
      if (to_lang === from_lang) {
        continue;
      }
      const target_path = join(i18n_dir, to_lang, yml_file),
        target_data = existsSync(target_path) ? load(read(target_path)) : {},
        translated = await tranVal(ali_tran, from_lang, to_lang, src_data, cache_data, target_data);
      write(target_path, dump(translated));
    }
    write(cache_path, dump(new_cache_data));
  }
};
