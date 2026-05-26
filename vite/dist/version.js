import { existsSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";
import write from "@3-/write";
import ROOT from "~/vite/const/ROOT.js";

const parseVer = async (file_path) => {
    try {
      return (await import(file_path)).default;
    } catch {}
  },
  bumpVersion = (version) => {
    const parts = version.split(".");
    parts[2] = String(parseInt(parts[2] || "0", 10) + 1);
    return parts.join(".");
  };

export default async (name, caller_filename) => {
  const ver_dir = join(ROOT, "conf/web/ver"),
    ver_path = join(ver_dir, name + ".js"),
    version = (await parseVer(ver_path)) || "0.1.0";

  if (!existsSync(ver_dir)) {
    mkdirSync(ver_dir, { recursive: true });
  }
  const writeVer = (v) => {
      write(
        ver_path,
        "// DON'T EDIT, GEN BY " +
          relative(ROOT, caller_filename) +
          '\nexport default "' +
          v +
          '";',
      );
    },
    save = () => {
      writeVer(bumpVersion(version));
    };

  writeVer(version);

  return [version, save];
};
