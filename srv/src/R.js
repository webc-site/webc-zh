import key from "./lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import u64B255 from "@3-/intbin/u64B255.js";
import utf8e from "@3-/utf8/utf8e.js";

const KEY_JS = key("js:"),
  KEY_SRV = key("srv:");

export const /*
  用于根据域名查找服务ID
  string host:[域名] 服务ID (u64Bin)
  */
  R_HOST = (host) => "host:" + host,
  /*
用于加载路径对应的 worker 脚本
string js:[服务ID]:[路径] [代码, [FLAG_COMPATIBILITY_DATE, 兼容日期], ...] (MsgPack 数组)
*/ R_JS = (srv_id, path) =>
    KEY_JS(
      u64B255(srv_id),
      [
        // 58 是 ":" 的 ASCII 码
        58,
      ],
      utf8e(path),
    ),
  /*
  用于管理服务下的全部路径脚本
  hash srv:[服务ID] (无符号64位二进制键) 散列表 (属性: 路径, 值: [代码, 兼容日期])
  */
  R_SRV = (id) => KEY_SRV(u64Bin(id)),
  /*
  用于根据服务名查找服务ID
  string name:[服务名] 服务ID (数值)
  */
  R_SRV_NAME = (name) => "name:" + name,
  /*
  用于生成唯一的服务ID
  string id:srv 自增服务ID计数器 (数值)
  */
  R_SRV_ID_INCR = "id:srv";
