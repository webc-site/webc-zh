import key from "../../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";

/*
用于根据域名查找域名ID
string
hostId:[域名] → 域名ID (数值)
*/
export const R_ID_BY_HOST = (host) => "hostId:" + host,
  /*
  Mini-ID反查域名
  用于根据域名ID查找域名
  string
  idHost:[域名ID] → 域名 (字符串)
  */
  R_ID_HOST = key("idHost:", (host_id) => u64Bin(host_id)),
  /*
  用于生成唯一的域名ID
  string
  idHost 自增域名ID计数器 (数值)
  */
  R_HOST_ID = "hostId";
