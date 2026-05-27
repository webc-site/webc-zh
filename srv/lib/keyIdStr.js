import key from "./key.js";
import u64B255 from "@3-/intbin/u64B255.js";
import utf8e from "@3-/utf8/utf8e.js";
import u8merge from "@3-/u8/u8merge.js";

export default (prefix) =>
  key(prefix, (id, str) =>
    u8merge(
      u64B255(id),
      [
        // 58 是 ":" 的 ASCII 码
        58,
      ],
      utf8e(str),
    ),
  );
