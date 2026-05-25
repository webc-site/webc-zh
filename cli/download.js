import { mkdirSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { x } from "tar";
import { CACHE } from "./const/DIR.js";

export const cache = (version) => join(CACHE, version),
  download = async (url, dir) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to download tarball: " + res.statusText);
    }
    const bin = new Uint8Array(await res.arrayBuffer()),
      tmp = tmpdir(),
      now = Date.now(),
      tgz = join(tmp, "webc-tarball-" + now + ".tgz"),
      ext = join(tmp, "webc-extract-" + now);

    writeFileSync(tgz, bin);
    mkdirSync(ext, { recursive: true });
    try {
      await x({ file: tgz, cwd: ext });
      const pkg = join(ext, "package");
      mkdirSync(dirname(dir), { recursive: true });
      renameSync(pkg, dir);
    } finally {
      rmSync(tgz, { force: true });
      rmSync(ext, { recursive: true, force: true });
    }
  };
