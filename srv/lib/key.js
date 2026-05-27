import u8merge from "@3-/u8/u8merge.js";
import utf8e from "@3-/utf8/utf8e.js";

export default (prefix, suffix) => {
  const pre = utf8e(prefix);
  return (...li) => Buffer.from(u8merge(pre, suffix(...li)));
};
