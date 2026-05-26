import { existsSync, mkdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import read from "@3-/read";
import { write, copy, findXDeps } from "./util.js";
import { rewriteImports, copyAndResolveX } from "./xResolve.js";
import parseImports from "./parseImports.js";
import copyAndProcess from "./copyAndProcess.js";

export default (src_path, dest_path, dir, processed_files, processed_x) => {
  if (processed_files.has(src_path)) return;
  processed_files.add(src_path);

  if (!existsSync(src_path)) return;

  const ext_name = extname(src_path).toLowerCase();
  mkdirSync(dirname(dest_path), { recursive: true });

  if (ext_name === ".js") {
    const content = read(src_path);
    findXDeps(content).forEach((dep) => copyAndResolveX(dep, dir, processed_x));
    write(dest_path, rewriteImports(content, dest_path));

    parseImports(content).forEach((rel_import) => {
      const import_src = resolve(dirname(src_path), rel_import),
        import_dest = resolve(dirname(dest_path), rel_import);
      copyAndProcess(import_src, import_dest, dir, processed_files, processed_x);
    });
  } else {
    copy(src_path, dest_path);
  }
};
