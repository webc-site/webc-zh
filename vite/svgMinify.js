import svgMinify from "~/vite/lib/svgMinify.js";

export default (content) => {
  try {
    return svgMinify(content);
  } catch (e) {
    console.error(e);
    return content;
  }
};
