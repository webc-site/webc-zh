import sveltePlugin from "~/vite/svelte.js";
import css2nest from "~/vite/css2nest.js";
import stylusPack from "~/vite/stylusPack.js";
import comSvg from "~/vite/comSvg.js";
import svgVar from "vite-plugin-svg-var";

export default (root, is_build, custom_element) => [
  svgVar(),
  comSvg(),
  sveltePlugin(root, custom_element),
  css2nest(is_build),
  stylusPack(is_build),
];
