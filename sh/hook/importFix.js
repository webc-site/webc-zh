import read from "@3-/read";
import write from "@3-/write";
import ext from "@3-/ext";
import { dirname, join, resolve, relative } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import yaml from "js-yaml";

const ROOT = dirname(dirname(import.meta.dirname)),
  X_DIR = join(ROOT, "x");

export default (ext_list, is_import_line) => {
  const argv = yargs(hideBin(process.argv)).argv,
    config_path = join(ROOT, ".importFix.yml");
  let ignore_list = [];
  try {
    const yml_content = read(config_path);
    if (yml_content) {
      const parsed = yaml.load(yml_content);
      if (parsed && Array.isArray(parsed.ignore)) {
        ignore_list = parsed.ignore;
      }
    }
  } catch (e) {
    console.warn("Failed to load .importFix.yml: " + e.message);
  }

  for (const file_path of argv._) {
    const resolved_path = resolve(file_path),
      rel_to_root = relative(ROOT, resolved_path).replaceAll("\\", "/"),
      should_ignore = ignore_list.some((item) => {
        const clean_item = item.replaceAll("\\", "/");
        if (clean_item.endsWith("/")) {
          return rel_to_root === clean_item.slice(0, -1) || rel_to_root.startsWith(clean_item);
        }
        return rel_to_root === clean_item;
      });

    if (should_ignore || !ext_list.includes(ext(file_path))) {
      continue;
    }
    const content = read(file_path);
    if (!content) {
      continue;
    }
    const lines = content.split("\n"),
      file_dir = dirname(resolved_path);
    let changed = false;

    const new_lines = lines.map((line) => {
      if (!is_import_line(line)) {
        return line;
      }

      return line.replace(/(['"])(\.\.?\/[^'"]*)\1/g, (match, quote, relative_path) => {
        const target_path = resolve(file_dir, relative_path);
        let new_path;
        if (target_path === X_DIR) {
          new_path = "x";
        } else if (target_path.startsWith(X_DIR + "/")) {
          new_path = "x/" + relative(X_DIR, target_path);
        } else {
          new_path = "~/" + relative(ROOT, target_path);
        }
        if (new_path !== relative_path) {
          changed = true;
        }
        return quote + new_path + quote;
      });
    });

    if (changed) {
      write(file_path, new_lines.join("\n"));
    }
  }
};
