import key from "../../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";

/*
用于根据用户ID查找用户名
string
userName:[用户ID] → 用户名 (字符串)
*/
export const R_USER_NAME = key("userName:", (uid) => u64Bin(uid)),
  /*
  用于根据用户ID查找邮箱
  string
  userMail:[用户ID] → 邮箱 (字符串)
  */
  R_USER_MAIL = key("userMail:", (uid) => u64Bin(uid)),
  /*
  用于根据邮箱查找用户ID
  string
  mail:[邮箱] → 用户ID (数值)
  */
  R_ID_BY_MAIL = (mail) => "mail:" + mail,
  /*
  用于生成唯一的用户ID
  string
  userId 自增用户ID计数器 (数值)
  */
  R_USER_ID = "userId";
