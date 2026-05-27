import { existsSync, readdirSync, statSync, rmSync, cpSync } from "node:fs";
import { join } from "node:path";
import write from "@3-/write";
import read from "@3-/read";
import COM_PKG from "~/conf/web/npm/COM_PKG.js";
import { ROOT, initDir } from "~/sh/dist/dist.js";
import stylRender from "~/cli/src/compile/stylus.js";
import copy from "~/sh/dist/com/copy.js";
import clean from "~/sh/dist/com/clean.js";

const DIST = join(ROOT, "dist", COM_PKG),
  COM_DIR = join(ROOT, "com");

export default () => {
  initDir(DIST);
  copy(COM_DIR, DIST);

  for (const name of readdirSync(COM_DIR)) {
    const dir_path = join(DIST, name);
    if (existsSync(dir_path) && statSync(dir_path).isDirectory()) {
      clean(dir_path);
    }
  }

  const x_src = join(ROOT, "x"),
    coms = readdirSync(COM_DIR).filter(
      (file) => statSync(join(COM_DIR, file)).isDirectory() && !file.startsWith("."),
    ),
    index_content = "export default " + JSON.stringify(coms) + ";\n",
    reset_styl = join(ROOT, "styl", "reset.styl");

  for (const name of coms) {
    const var_styl_path = join(DIST, name, "var.styl");
    if (existsSync(var_styl_path)) {
      const var_content = read(var_styl_path),
        lines = var_content.split("\n"),
        cleaned_lines = [];
      for (const line of lines) {
        const match = line.match(/@import\s+['"]\.\.\/([^/]+)\/([^/]+)\.styl['"]/);
        if (!match) {
          cleaned_lines.push(line);
        }
      }
      const cleaned_var = cleaned_lines.join("\n").trim();
      if (cleaned_var === "") {
        rmSync(var_styl_path);
      } else {
        write(var_styl_path, cleaned_lines.join("\n"));
      }
    }

    const com_dir_path = join(DIST, name);
    if (existsSync(com_dir_path)) {
      const styl_files = readdirSync(com_dir_path).filter(
        (file) => file.endsWith(".styl") && statSync(join(com_dir_path, file)).isFile(),
      );

      for (const file of styl_files) {
        const styl_path = join(com_dir_path, file),
          content = read(styl_path),
          css = stylRender(content, styl_path),
          dest_css_path = styl_path.slice(0, -5) + ".css";
        if (css.trim() !== "") {
          write(dest_css_path, css);
        }
        rmSync(styl_path);
      }
    }
  }

  for (const name of coms) {
    const var_styl_src = join(COM_DIR, name, "var.styl"),
      peer_imports = [];
    if (existsSync(var_styl_src)) {
      const var_content = read(var_styl_src),
        lines = var_content.split("\n");
      for (const line of lines) {
        const match = line.match(/@import\s+['"]\.\.\/([^/]+)\/([^/]+)\.styl['"]/);
        if (match) {
          const dep_name = match[1],
            dep_file = match[2];
          const dep_css_filename = dep_file === "var" ? "var.css" : dep_name + ".css",
            dep_css_path = join(DIST, dep_name, dep_css_filename);
          if (existsSync(dep_css_path)) {
            peer_imports.push("./" + dep_name + "/" + dep_css_filename);
          }
        }
      }
    }

    const entry_imports = [],
      com_dir_path = join(DIST, name);
    if (existsSync(com_dir_path)) {
      const css_files = readdirSync(com_dir_path).filter(
          (file) => file.endsWith(".css") && statSync(join(com_dir_path, file)).isFile(),
        ),
        css_imports = css_files.map((file) => "./" + name + "/" + file),
        com_js = join(com_dir_path, name + ".js");
      if (existsSync(com_js)) {
        entry_imports.push("./" + name + "/" + name + ".js");
      }
      css_imports.sort((a, b) => {
        if (a.endsWith("/var.css")) return -1;
        if (b.endsWith("/var.css")) return 1;
        return a.localeCompare(b);
      });
      entry_imports.push(...css_imports);

      const entry_lines = [];
      for (const x of peer_imports) {
        entry_lines.push("import '" + x + "';");
      }
      entry_lines.push(...entry_imports.map((x) => 'import "' + x + '";'));

      if (entry_lines.length > 0) {
        write(join(DIST, name + ".js"), entry_lines.join("\n") + "\n");
      }
    }
  }

  if (existsSync(x_src)) {
    cpSync(x_src, join(DIST, "x"), { recursive: true });
  }
  if (existsSync(reset_styl)) {
    const content = read(reset_styl),
      css = stylRender(content, reset_styl);
    write(join(DIST, "styl", "reset.css"), css);
  }
  write(join(DIST, "index.js"), index_content);
};
