import { existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import read from "@3-/read";
import { write } from "./util.js";
import { LIB } from "../const/DIR.js";
import copyDir from "./copyDir.js";
import assets from "./assets.js";
import copyCss from "./copyCss.js";
import parseImports from "./parseImports.js";
import copyAndProcess from "./copyAndProcess.js";
import verYml from "./verYml.js";
import depYml from "./depYml.js";

export default (dir, canonical_name) => {
  const processed_x = new Set(),
    processed_files = new Set(),
    com_src_dir = join(dir, canonical_name),
    entry_js_name = canonical_name + ".js",
    src_entry = join(dir, entry_js_name),
    dest_entry = join(LIB, entry_js_name),
    dest_com_dir = join(LIB, canonical_name);

  verYml(dir, dest_com_dir);

  if (existsSync(com_src_dir)) {
    copyDir(com_src_dir, dest_com_dir);
  }

  if (existsSync(src_entry)) {
    const entry_content = read(src_entry);
    mkdirSync(dirname(dest_entry), { recursive: true });
    write(dest_entry, entry_content);
    processed_files.add(src_entry);

    parseImports(entry_content).forEach((rel_import) => {
      const import_src = resolve(dir, rel_import),
        import_dest = resolve(LIB, rel_import);
      copyAndProcess(import_src, import_dest, dir, processed_files, processed_x);
    });
  }

  copyCss(dir);
  assets(com_src_dir, canonical_name);

  return depYml(dir, canonical_name, processed_files);
};
