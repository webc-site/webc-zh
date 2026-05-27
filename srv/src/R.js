import key from "./lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import u64B255 from "@3-/intbin/u64B255.js";
import utf8e from "@3-/utf8/utf8e.js";

const KEY_JS = key("js:"),
  KEY_SRV_JS = key("srvJs:");

export const /*
  用于根据域名查找服务ID
  string
  host:[域名] 服务ID (u64Bin)
  */
  R_HOST = (host) => "host:" + host,
  /*
  用于加载路径对应的 worker 脚本
  string
  js:[服务ID]:[路径] [代码, [FLAG_COMPATIBILITY_DATE, 兼容日期], ...] (MsgPack 数组)
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
  hash
  srvJs:[服务ID] (无符号64位二进制键) 散列表 (属性: 路径, 值: [代码, 兼容日期])
  */
  R_SRV = (id) => KEY_SRV_JS(u64Bin(id)),
  /*
  用于根据服务名查找服务ID
  string
  srv:[服务名] 服务ID (u64Bin)
  */
  R_SRV_ID = (name) => "srv:" + name,
  /*
  用于生成唯一的服务ID
  string
  idSrv 自增服务ID计数器 (数值)
  */
  R_SRV_ID_INCR = "idSrv",
  /*
  用于记录服务所属的用户ID
  string
  srvUser:[服务ID] 用户ID (数值)
  */
  R_SRV_USER = (srv_id) => "srvUser:" + srv_id,
  /*
  用于查询用户绑定的全部域名
  zset
  userHost:[用户ID] [最后修改时间戳(秒)] [域名] (字符串)
  */
  R_USER_HOST = (uid) => "userHost:" + uid,
  /*
  用于查询服务绑定的全部域名
  zset
  srvHost:[服务ID] [最后修改时间戳(秒)] [域名] (字符串)
  */
  R_SRV_HOST = (srv_id) => "srvHost:" + srv_id;
