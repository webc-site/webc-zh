import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseSync } from "oxc-parser";
import read from "@3-/read";
import { COM_DIR } from "~/vite/dist/comGen/const.js";
import save from "~/vite/gen/doc/save.js";
import CDN_PKG from "~/conf/web/npm/CDN_PKG.js";
import VER from "~/conf/web/ver/webc.site.js";

const mergeXImports = (content) => {
  if (!content.includes('from "x/') && !content.includes("from 'x/")) return content;
  const ast = parseSync("demo.js", content);
  if (ast.errors && ast.errors.length > 0) return content;
  const matching_nodes = ast.program.body.filter(
    ({ type, source }) => type === "ImportDeclaration" && source.value.startsWith("x/"),
  );
  if (matching_nodes.length === 0) return content;

  matching_nodes.sort((a, b) => a.start - b.start);

  const imported_names = [],
    seen_imported = new Set();
  for (const node of matching_nodes) {
    for (const specifier of node.specifiers) {
      if (specifier.type === "ImportSpecifier") {
        const { imported, local } = specifier,
          imported_name = imported.name,
          local_name = local.name,
          name_str =
            imported_name === local_name ? imported_name : imported_name + " as " + local_name;
        if (!seen_imported.has(name_str)) {
          seen_imported.add(name_str);
          imported_names.push(name_str);
        }
      }
    }
  }

  const merged_import = "import { " + imported_names.join(", ") + ' } from "x.js";',
    first_import_start = matching_nodes[0].start;

  let last_idx = 0,
    new_content = "";
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
};

const deps = (name, seen = new Set()) => {
  if (seen.has(name)) return seen;
  seen.add(name);
  const var_styl_path = join(COM_DIR, name, "var.styl");
  if (existsSync(var_styl_path)) {
    const content = read(var_styl_path),
      matches = content.matchAll(/@import\s+['"]\.\.\/([^/]+)\/[^'"]+['"]/g);
    for (const match of matches) {
      deps(match[1], seen);
    }
  }
  return seen;
};

const svgVars = (com_name) => {
  const var_path = join(COM_DIR, com_name, "var.styl"),
    vars = [];
  if (existsSync(var_path)) {
    const content = read(var_path),
      lines = content.split("\n");
    for (const line of lines) {
      const match = /^\s*(--\w+Svg)\s+(.+)$/.exec(line);
      if (match) {
        const [, var_name, val] = match,
          url_match = /url\(\s*['"]?([^'")]+?\.svg(?:[#?][^'")]*)?)['"]?\s*\)/.exec(val);
        if (url_match) {
          const [, raw_path] = url_match,
            [path_part, hash_part = ""] = raw_path.split(/(?=[#?])/),
            rel_path = path_part.startsWith("./") ? path_part.slice(2) : path_part,
            svg_abs_path = resolve(COM_DIR, com_name, rel_path);
          if (existsSync(svg_abs_path)) {
            const svg_content = encodeURIComponent(read(svg_abs_path));
            vars.push([var_name, 'url("data:image/svg+xml;utf8,' + svg_content + hash_part + '")']);
          }
        }
      }
    }
  }
  return vars;
};

export default (coms) => {
  const demos = [];
  for (const name of coms) {
    const dir = join(COM_DIR, name, "demo"),
      htm_path = join(dir, "_.htm");
    if (existsSync(htm_path)) {
      const js_path = join(dir, "_.js"),
        css_path = join(dir, "_.css"),
        htm = read(htm_path),
        js_fp = join(COM_DIR, name, name + ".js");

      let js = mergeXImports(existsSync(js_path) ? read(js_path) : "");
      if (existsSync(js_fp) && read(js_fp).includes("export default")) {
        const camel = name[0].toLowerCase() + name.slice(1),
          import_name = new RegExp("\\b" + camel + "\\b").test(js) ? camel : name;
        js =
          "import " +
          import_name +
          ' from "https://cdn.jsdelivr.net/npm/' +
          CDN_PKG +
          "@" +
          VER +
          "/" +
          name +
          '.js";\n' +
          js;
      }

      const dep_set = deps(name),
        svg_vars = [];
      for (const dep of dep_set) {
        svg_vars.push(...svgVars(dep));
      }
      const svg_css =
        svg_vars.length > 0
          ? ":root {\n" + svg_vars.map(([k, v]) => "  " + k + ": " + v + ";").join("\n") + "\n}\n"
          : "";
      const css = svg_css + (existsSync(css_path) ? read(css_path) : "");

      demos.push([name, [htm, js, css]]);
    }
  }
  save("demo/index.js", JSON.stringify(demos));
};
