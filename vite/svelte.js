import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import pug from "~/vite/pug/build.js";

export default (root, custom_element) => {
  const conf = {
    preprocess: [pug(root), vitePreprocess()],
  };
  if (custom_element) {
    conf.compilerOptions = {
      customElement: true,
    };
  }
  return svelte(conf);
};
