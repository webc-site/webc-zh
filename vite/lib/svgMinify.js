import { optimize } from "svgo";

export default (content) =>
  optimize(content, {
    multipass: true,
    plugins: ["preset-default", "removeViewBox"],
  }).data;
