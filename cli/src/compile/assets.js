import { existsSync, readdirSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import read from "@3-/read";
import ext from "@3-/ext";
import { write, copy } from "./util.js";
import { LIB, PUBLIC } from "../const/DIR.js";

const ESCAPE_REG = /[.*+?^${}()|[\]\\]/g,
  escapeRegExp = (str) => str.replace(ESCAPE_REG, "\\$&");

export default (com_src_dir, canonical_name) => {
  if (!existsSync(com_src_dir)) return;

  const assets = [],
    collectAssets = (current_dir) => {
      readdirSync(current_dir).forEach((entry) => {
        const full_path = join(current_dir, entry),
          stat = statSync(full_path);
        if (stat.isDirectory()) {
          collectAssets(full_path);
        } else {
          const extension = ext(entry);
          if (extension && extension !== "js" && extension !== "css" && extension !== "styl") {
            assets.push({
              src: full_path,
              rel: relative(com_src_dir, full_path),
            });
          }
        }
      });
    };
  collectAssets(com_src_dir);

  if (assets.length > 0) {
    assets.forEach((item) => {
      const { src, rel } = item,
        dest_public_path = join(PUBLIC, "com", canonical_name, rel);
      mkdirSync(dirname(dest_public_path), { recursive: true });
      copy(src, dest_public_path);
    });

    const com_dest_dir = join(LIB, canonical_name);
    if (existsSync(com_dest_dir)) {
      const rewriteCss = (current_dir) => {
        readdirSync(current_dir).forEach((entry) => {
          const full_path = join(current_dir, entry),
            stat = statSync(full_path);
          if (stat.isDirectory()) {
            rewriteCss(full_path);
          } else if (entry.endsWith(".css")) {
            let css_content = read(full_path),
              modified = false;
            assets.forEach((item) => {
              const { rel } = item,
                regex = new RegExp(
                  "url\\(\\s*['\"]?\\s*(?:\\./)?" +
                    escapeRegExp(rel) +
                    "([?#][^'\")]*)?\\s*['\"]?\\s*\\)",
                  "g",
                ),
                target_url = "/com/" + canonical_name + "/" + rel;
              css_content = css_content.replace(regex, (match, suffix = "") => {
                modified = true;
                return 'url("' + target_url + suffix + '")';
              });
            });
            if (modified) {
              write(full_path, css_content);
            }
          }
        });
      };
      rewriteCss(com_dest_dir);
    }
  }
};
