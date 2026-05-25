import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import read from "@3-/read";
import { COM_DIR } from "~/vite/dist/comGen/const.js";
import save from "~/vite/gen/doc/save.js";

const deps = (name, seen = new Set()) => {
  if (seen.has(name)) return seen;
  seen.add(name);
  const var_styl_path = join(COM_DIR, name, "var.styl");
  if (existsSync(var_styl_path)) {
    const content = read(var_styl_path);
    const matches = content.matchAll(/@import\s+['"]\.\.\/([^/]+)\/[^'"]+['"]/g);
    for (const match of matches) {
      deps(match[1], seen);
    }
  }
  return seen;
};

const svgVars = (comName) => {
  const var_path = join(COM_DIR, comName, "var.styl"),
    vars = [];
  if (existsSync(var_path)) {
    const content = read(var_path),
      lines = content.split("\n");
    for (const line of lines) {
      const match = /^\s*(--\w+Svg)\s+(.+)$/.exec(line);
      if (match) {
        const [, varName, val] = match,
          urlMatch = /url\(\s*['"]?([^'")]+?\.svg(?:[#?][^'")]*)?)['"]?\s*\)/.exec(val);
        if (urlMatch) {
          const [, rawPath] = urlMatch,
            [pathPart, hashPart = ""] = rawPath.split(/(?=[#?])/),
            relPath = pathPart.startsWith("./") ? pathPart.slice(2) : pathPart,
            svgAbsPath = resolve(COM_DIR, comName, relPath);
          if (existsSync(svgAbsPath)) {
            const content = encodeURIComponent(readFileSync(svgAbsPath, "utf-8"));
            vars.push([varName, 'url("data:image/svg+xml;utf8,' + content + hashPart + '")']);
          }
        }
      }
    }
  }
  return vars;
};

const genDemo = (coms) => {
  const demos = [];
  for (const name of coms) {
    const dir = join(COM_DIR, name, "demo"),
      htm_path = join(dir, "_.htm");
    if (existsSync(htm_path)) {
      const js_path = join(dir, "_.js"),
        css_path = join(dir, "_.css"),
        htm = read(htm_path),
        js = existsSync(js_path) ? read(js_path) : "";

      let css = existsSync(css_path) ? read(css_path) : "";
      const dep_set = deps(name),
        svg_vars = [];
      for (const dep of dep_set) {
        svg_vars.push(...svgVars(dep));
      }
      if (svg_vars.length > 0) {
        const svg_css =
          ":root {\n" + svg_vars.map(([k, v]) => "  " + k + ": " + v + ";").join("\n") + "\n}\n";
        css = svg_css + css;
      }

      demos.push([name, [htm, js, css]]);
    }
  }
  save("demo/index.js", JSON.stringify(demos));
};

export default genDemo;
