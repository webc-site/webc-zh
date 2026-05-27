import key from "../../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import u64B255 from "@3-/intbin/u64B255.js";
import utf8e from "@3-/utf8/utf8e.js";
import u8merge from "@3-/u8/u8merge.js";

/*
用于根据用户ID查找邮箱
string
userMail:[用户ID] → 邮箱 (字符串)
*/
export const R_USER_MAIL = key("userMail:", (uid) => u64Bin(uid)),
  /*
  用于根据邮箱查找用户ID
  string
  mail:[域名ID]:[邮箱前缀] → 用户ID (数值)
  */
  R_ID_BY_MAIL = key("mail:", (host_id, prefix) =>
    u8merge(
      u64B255(host_id),
      [
        // 58 是 ":" 的 ASCII 码
        58,
      ],
      utf8e(prefix),
    ),
  );
