import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseSync } from "oxc-parser";
import read from "@3-/read";
import write from "@3-/write";
import { GEN_DIR } from "~/vite/dist/comGen/const.js";
import jsMinify from "~/vite/dist/comGen/jsMinify.js";

const getImports = (code, filename) => {
    const ast = parseSync(filename, code),
      imports = [];
    if (ast.program && ast.program.body) {
      for (const node of ast.program.body) {
        if (node.type == "ImportDeclaration") {
          imports.push(node.source.value);
        }
      }
    }
    return imports;
  },
  getLocalDeps = (code, filename) => {
    const imports = getImports(code, filename),
      deps = [];
    for (const imp of imports) {
      if (imp.startsWith("x/") || imp.startsWith("./")) {
        const parts = imp.split("/"),
          name = parts[parts.length - 1].replace(/\.js$/, "");
        if (name) {
          deps.push(name);
        }
      }
    }
    return deps;
  },
  topoSort = (items) => {
    const sorted = [],
      visited = {},
      visiting = {};

    const visit = (name) => {
      if (visiting[name]) {
        console.warn("⚠️ Cycle detected in dependencies for:", name);
        return;
      }
      if (!visited[name]) {
        visiting[name] = true;
        const item = items.find((x) => x.name == name);
        if (item) {
          for (const dep of item.deps) {
            visit(dep);
          }
        }
        visiting[name] = false;
        visited[name] = true;
        if (item) {
          sorted.push(item);
        }
      }
    };

    for (const item of items) {
      visit(item.name);
    }

    return sorted;
  },
  genX = (x_dir) => {
    if (!existsSync(x_dir)) {
      console.warn("⚠️ x directory not found:", x_dir);
      return;
    }
    const files = readdirSync(x_dir),
      items = [],
      readme_path = join(x_dir, "README.md");

    let readme = ["x", "", ""];
    if (existsSync(readme_path)) {
      const raw = read(readme_path),
        lines = raw.split("\n"),
        title = lines[0].replace(/^#\s*/, "").trim(),
        body = lines.slice(1).join("\n").trim(),
        colon_index = title.indexOf(":");
      if (colon_index >= 0) {
        readme = [title.slice(0, colon_index).trim(), title.slice(colon_index + 1).trim(), body];
      } else {
        readme = [title, "", body];
      }
    }

    for (const file of files) {
      if (file.endsWith(".js") && file != "package.json" && !file.startsWith(".")) {
        const name = file.slice(0, -3),
          md_path = join(x_dir, name + ".md"),
          js_path = join(x_dir, file);

        let title = name,
          body = "";
        if (existsSync(md_path)) {
          const raw = read(md_path),
            lines = raw.split("\n");
          title = lines[0].replace(/^#\s*/, "").trim();
          body = lines.slice(1).join("\n").trim();
        } else {
          console.warn("⚠️ [docGen] Missing MD description for x/" + file);
        }

        const code = read(js_path),
          deps = getLocalDeps(code, file);

        items.push({
          name,
          title,
          doc: body,
          code,
          deps,
        });
      }
    }

    const list = topoSort(items).map((item) => [item.name, item.title, item.doc, item.code]);

    const readme_file = join(GEN_DIR, "x_readme.js"),
      file_path = join(GEN_DIR, "x.js"),
      content = JSON.stringify(list);
    write(readme_file, jsMinify("export default " + JSON.stringify(readme) + ";"));
    write(file_path, jsMinify("export default " + content + ";"));
  };

export default genX;
