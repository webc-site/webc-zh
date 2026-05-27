import key from "../lib/key.js";
import u64B255 from "@3-/intbin/u64B255.js";
import utf8e from "@3-/utf8/utf8e.js";
import u8merge from "@3-/u8/u8merge.js";

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
  */ R_JS = key("js:", (srv_id, path) =>
    u8merge(
      u64B255(srv_id),
      [
        // 58 是 ":" 的 ASCII 码
        58,
      ],
      utf8e(path),
    ),
  ),
  /*
  用于生成唯一的服务ID
  string
  srvId 自增服务ID计数器 (数值)
  */
  R_SRV_ID = "srvId";
