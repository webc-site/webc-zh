import key from "../../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";

/*
用于根据域名查找服务ID
string
srv:[服务名] → 服务ID (u64Bin)
*/
export const R_SRV_NAME_ID = (name) => "srv:" + name,
  /*
  用于根据服务ID查找服务名
  string
  idSrv:[服务ID] → 服务名 (字符串)
  */
  R_ID_SRV = key("idSrv:", (srv_id) => u64Bin(srv_id)),
  /*
  用于记录服务所属的组织ID
  string
  srvOrg:[服务ID] → 组织ID (数值)
  */
  R_SRV_ORG_ID = key("srvOrg:", (srv_id) => u64Bin(srv_id)),
  /*
  用于查询服务绑定的全部域名（服务可跨组织绑定域名，即绑定的域名ID可属于其他组织）
  zset
  srvHost:[服务ID] [最后修改时间戳(秒)] → [域名ID] (数值)
  */
  R_SRV_HOST_ID = key("srvHost:", (srv_id) => u64Bin(srv_id)),
  /*
  用于管理服务下的全部路径脚本
  zset
  srvJs:[服务ID] (无符号64位二进制键) [最后修改时间戳(秒)] → [路径] (字符串)
  */
  R_SRV_JS_PATH = key("srvJs:", (id) => u64Bin(id));
