import { cpSync, statSync } from "node:fs";
import { basename } from "node:path";
import ext from "@3-/ext";

const ALLOW_EXT = new Set([
  "styl",
  "js",
  "json",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "ico",
  "avif",
  "svg",
]);

export default (src, dest) => {
  const filter = (src_path) => {
    const stat = statSync(src_path),
      name = basename(src_path);
    if (stat.isDirectory()) {
      return !["demo", "node_modules"].includes(name) && !name.startsWith(".");
    }
    if (name === "Demo.svelte") {
      return false;
    }
    return ALLOW_EXT.has(ext(name));
  };
  cpSync(src, dest, { recursive: true, filter });
};
