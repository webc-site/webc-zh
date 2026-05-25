import { existsSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { parseSync } from "oxc-parser";
import ROOT from "~/vite/const/ROOT.js";

const IMPORTMAP_DIR = ROOT,
  isQuoted = (str) => {
    const quote = str[0];
    return ['"', "'", "`"].includes(quote) && quote === str[str.length - 1];
  },
  fileAST = (file_path, file_name) => {
    if (!existsSync(file_path)) return;
    try {
      const code = readFileSync(file_path, "utf8");
      return [code, parseSync(file_name, code)];
    } catch {
      // return undefined
    }
  },
  collect = (res, code) => {
    const imports = new Set();
    if (res?.module) {
      for (const { moduleRequest } of res.module.staticImports) {
        if (moduleRequest?.value) {
          imports.add(moduleRequest.value);
        }
      }
      for (const { entries } of res.module.staticExports) {
        for (const { moduleRequest } of entries) {
          if (moduleRequest?.value) {
            imports.add(moduleRequest.value);
          }
        }
      }
      for (const { moduleRequest } of res.module.dynamicImports) {
        if (moduleRequest) {
          const { start, end } = moduleRequest,
            specifier = code.slice(start, end);
          if (isQuoted(specifier)) {
            imports.add(specifier.slice(1, -1));
          }
        }
      }
    }
    return imports;
  },
  resolveDeps = (sub, file_name, all_used) => {
    const file_path = join(IMPORTMAP_DIR, sub, file_name),
      ast_info = fileAST(file_path, file_name);

    if (!ast_info) return;

    const [code, res] = ast_info,
      imports = collect(res, code),
      abs_sub_dir = join(IMPORTMAP_DIR, sub);

    for (const dep of imports) {
      const absolute_path = dep.startsWith(sub + "/")
          ? join(abs_sub_dir, dep.slice(sub.length + 1))
          : join(abs_sub_dir, dirname(file_name), dep),
        is_valid =
          absolute_path.startsWith(abs_sub_dir) &&
          existsSync(absolute_path) &&
          statSync(absolute_path).isFile();

      if (is_valid) {
        const relative_name = relative(abs_sub_dir, absolute_path);
        if (!all_used.has(relative_name)) {
          all_used.add(relative_name);
          resolveDeps(sub, relative_name, all_used);
        }
      }
    }
  };

export default resolveDeps;
