import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export default (ROOT, from_lang) => {
  const com_dir = join(ROOT, "com"),
    subs = readdirSync(com_dir).filter((name) => statSync(join(com_dir, name)).isDirectory()),
    res = [];

  for (const sub of subs) {
    const i18n_dir = join(com_dir, sub, "i18n");
    if (!existsSync(i18n_dir)) {
      continue;
    }
    const from_dir = join(i18n_dir, from_lang);
    if (!existsSync(from_dir)) {
      continue;
    }
    const yml_files = readdirSync(from_dir).filter((file) => file.endsWith(".yml"));
    for (const yml_file of yml_files) {
      res.push([i18n_dir, yml_file, join(from_dir, yml_file)]);
    }
  }
  return res;
};
