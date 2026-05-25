import { existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import ROOT_PATH from "~/vite/const/ROOT.js";
import versionInit from "~/vite/dist/version.js";

export const ROOT = ROOT_PATH,
  initDir = (dir) => {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const readme = join(ROOT, "README.md");
    if (existsSync(readme)) {
      cpSync(readme, join(dir, "README.md"));
    }
  },
  writePkg = (name, dist_dir, version) => {
    const pkg_path = join(ROOT, "cli", "package.json");
    if (existsSync(pkg_path)) {
      const pkg = JSON.parse(read(pkg_path));
      pkg.name = name;
      pkg.version = version;
      write(join(dist_dir, "package.json"), JSON.stringify(pkg));
    }
  },
  load = async (name, filename, version_arg) => {
    if (version_arg) {
      return version_arg;
    }
    const ver_path = join(ROOT, "conf", "ver", name + ".js");
    if (!existsSync(ver_path)) {
      const [version] = await versionInit(name, filename);
      return version;
    }
    for (const file_path of [join(ROOT, ".cache", name + ".js"), ver_path]) {
      if (existsSync(file_path)) {
        try {
          return (await import(file_path)).default;
        } catch {}
      }
    }
    return "0.1.0";
  };
