import base from "~/vite/plugin/base.js";
import comSvg from "~/vite/comSvg.js";

export default (root, is_build, custom_element) => {
  const list = base(root, is_build, custom_element);
  list.splice(1, 0, comSvg());
  return list;
};
