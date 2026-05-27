import key from "../../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import binU64 from "@3-/intbin/binU64.js";

/*
用于根据用户ID查找邮箱
string
user{mail}:[用户ID] → 邮箱 (字符串)
*/
export const R_USER_MAIL = key("user{mail}:", (uid) => u64Bin(uid)),
  /*
  用于根据邮箱查找用户ID
  string
  {mail}:[域名]:[邮箱前缀] → 用户ID (u64Bin)
  */
  R_ID_BY_MAIL = (host, prefix) => "{mail}:" + host + ":" + prefix,
  /*
  用于根据邮箱ID查找邮箱
  string
  id{mail}:[邮箱ID] → 邮箱 (字符串)
  */
  R_ID_MAIL = key("id{mail}:", (mail_id) => u64Bin(mail_id)),
  /*
  用于生成唯一的邮箱ID
  string
  {mail}Id 自增邮箱ID计数器 (数值)
  */
  R_MAIL_ID = "{mail}Id",
  /*
  调用 redis function 获取或创建邮箱ID
  */
  mailId = async (redis, prefix, host) => {
    const r = await redis.fcallBuffer("mailId", 0, prefix, host);
    return r ? binU64(r) : r;
  },
  /*
  通过id获取mail
  */
  idMail = (redis, mail_id) => redis.get(R_ID_MAIL(mail_id));
