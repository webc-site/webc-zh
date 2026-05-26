import { existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import { parseSync } from "oxc-parser";

const relativePrefix = (from_dir, to_dir) => {
    const rel = relative(from_dir, to_dir);
    return rel ? (rel.endsWith("/") ? rel : rel + "/") : "./";
  },
  walk = (dir, callback) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const file_path = join(dir, entry),
        stat = statSync(file_path);
      if (stat.isDirectory()) {
        walk(file_path, callback);
      } else if (stat.isFile()) {
        callback(file_path);
      }
    }
  },
  parseImports = (ast, sub_prefix) => {
    const matching_nodes = [];
    for (const node of ast.program.body) {
      if (node.type === "ImportDeclaration" && node.source.value.startsWith(sub_prefix)) {
        matching_nodes.push(node);
      }
    }
    return matching_nodes;
  },
  collectImportNames = (matching_nodes, sub_prefix, collected_files) => {
    const imported_names = [];
    for (const node of matching_nodes) {
      const filename = node.source.value.slice(sub_prefix.length);
      collected_files.add(filename);
      for (const specifier of node.specifiers) {
        if (specifier.type === "ImportSpecifier") {
          const imported_name = specifier.imported.name,
            local_name = specifier.local.name;
          imported_names.push(
            imported_name === local_name ? imported_name : imported_name + " as " + local_name,
          );
        }
      }
    }
    return imported_names;
  },
  replaceImports = (content, matching_nodes, merged_import) => {
    let last_idx = 0,
      new_content = "";
    const first_import_start = matching_nodes[0].start;
    for (const node of matching_nodes) {
      new_content += content.slice(last_idx, node.start);
      if (node.start === first_import_start) {
        new_content += merged_import;
      }
      let end = node.end;
      if (content[end] === "\r") {
        end += 1;
      }
      if (content[end] === "\n") {
        end += 1;
      }
      last_idx = end;
    }
    return new_content + content.slice(last_idx);
  },
  refactorFile = (file_path, dist_dir, sub_prefix, sub, collected_files) => {
    const content = read(file_path);
    if (!content.includes(sub_prefix)) return;
    const ast = parseSync(file_path, content);
    if (ast.errors && ast.errors.length > 0) return;
    const matching_nodes = parseImports(ast, sub_prefix);
    if (matching_nodes.length === 0) return;
    matching_nodes.sort((a, b) => a.start - b.start);
    const imported_names = collectImportNames(matching_nodes, sub_prefix, collected_files),
      prefix = relativePrefix(dirname(file_path), dist_dir),
      merged_import =
        "import { " + imported_names.join(", ") + ' } from "' + prefix + sub + '.js";',
      new_content = replaceImports(content, matching_nodes, merged_import);
    if (new_content !== content) {
      write(file_path, new_content);
    }
  };

export default (dist_dir, sub, collected_files) => {
  const sub_prefix = sub + "/";
  walk(dist_dir, (file_path) => {
    if (file_path.endsWith(".js")) {
      refactorFile(file_path, dist_dir, sub_prefix, sub, collected_files);
    }
  });
};
