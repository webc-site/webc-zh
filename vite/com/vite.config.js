import { defineConfig } from "vite";
import { join } from "node:path";
import { compileFile } from "pug";
import pug_conf from "~/conf/pug.js";
import { capitalize } from "~/vite/com/util.js";
import virtual from "~/vite/com/virtual.js";
import pluginComm from "~/vite/pluginComm.js";

export default (comp_name, root, is_build) => {
  const comp_dir = join(root, "com", comp_name),
    cap_name = capitalize(comp_name),
    out_dir = join(root, "dist/com", comp_name),
    html_file = join(comp_dir, cap_name + ".html"),
    entry_file = join(comp_dir, cap_name + ".entry.js"),
    template = compileFile(join(root, "pug/index.pug")),
    html_content = template({
      ...pug_conf,
      entry: cap_name + ".entry",
    }),
    entry_content =
      'import{mount}from"svelte";import Component from"./Demo.svelte";import{B}from"x/dom.js";mount(Component,{target:B});import "x/rmWait.js"';

  return defineConfig({
    root: comp_dir,
    base: "./",
    publicDir: is_build ? false : join(root, "public"),
    resolve: {
      alias: {
        "~/": root,
      },
    },
    plugins: [
      ...pluginComm(root, is_build),
      virtual(cap_name, html_content, entry_file, html_file, entry_content),
    ],

    build: {
      outDir: out_dir,
      emptyOutDir: true,
      rollupOptions: {
        input: html_file,
        output: {
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
  });
};
