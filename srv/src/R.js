import keyIdStr from "../lib/keyIdStr.js";

export const /*
  用于根据域名查找服务ID
  string
  host:[域名] → 服务ID (u64Bin)
  */
  R_HOST_SRV = (host) => "host:" + host,
  /*
  用于加载路径对应的 worker 脚本
  string
  js:[服务ID]:[路径] → [代码, [FLAG_COMPATIBILITY_DATE, 兼容日期], ...] (MsgPack 数组)
  */ R_JS = keyIdStr("js:"),
  /*
  用于生成唯一的服务ID
  string
  srvId 自增服务ID计数器 (数值)
  */
  R_SRV_ID = "srvId";
