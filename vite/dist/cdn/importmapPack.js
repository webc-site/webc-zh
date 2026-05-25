import { rmSync } from "node:fs";
import { join } from "node:path";
import { build } from "rolldown";
import write from "@3-/write";
import ROOT from "~/vite/const/ROOT.js";

const IMPORTMAP_DIR = ROOT;

export const packImportmap = async (dist_dir, sub, collected_files) => {
  if (!collected_files || collected_files.size === 0) return;
  const entry_content = Array.from(collected_files)
      .map((file_name) => 'export * from "./' + sub + "/" + file_name + '";')
      .join("\n"),
    temp_entry = join(IMPORTMAP_DIR, ".temp_" + sub + ".js");

  write(temp_entry, entry_content);
  try {
    await build({
      input: temp_entry,
      resolve: {
        alias: {
          [sub]: join(IMPORTMAP_DIR, sub),
        },
      },
      output: {
        file: join(dist_dir, sub + ".js"),
        format: "esm",
        minify: true,
        sourcemap: "hidden",
      },
    });
  } finally {
    rmSync(temp_entry, { force: true });
  }
};
