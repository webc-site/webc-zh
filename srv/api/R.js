import key from "../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";

export const /*
  用于根据域名查找服务ID
  string
  srv:[服务名] → 服务ID (u64Bin)
  */
  R_SRV_NAME_ID = (name) => "srv:" + name,
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
  用于查询组织拥有的全部服务
  zset
  orgSrv:[组织ID] [最后修改时间戳(秒)] → [服务ID] (数值)
  */
  R_ORG_SRV_ID = key("orgSrv:", (org_id) => u64Bin(org_id)),
  /*
  用于查询组织绑定的全部域名
  zset
  orgHost:[组织ID] [最后修改时间戳(秒)] → [域名ID] (数值)
  */
  R_ORG_HOST_ID = key("orgHost:", (org_id) => u64Bin(org_id)),
  /*
  用于管理组织内的成员与角色
  hset
  orgUser:[组织ID] → [用户ID] (u64Bin) : [身份角色] (u64Bin)
  */
  R_ORG_USER = key("orgUser:", (org_id) => u64Bin(org_id)),
  /*
  用于查询用户所在的组织列表
  zset
  userOrg:[用户ID] [最后访问时间戳(秒)] → [组织ID] (数值)
  */
  R_USER_ORG = key("userOrg:", (uid) => u64Bin(uid)),
  /*
  用于查询服务绑定的全部域名
  zset
  srvHost:[服务ID] [最后修改时间戳(秒)] → [域名ID] (数值)
  */
  R_SRV_HOST_ID = key("srvHost:", (srv_id) => u64Bin(srv_id)),
  /*
  用于根据域名查找域名ID
  string
  hostId:[域名] → 域名ID (数值)
  */
  R_ID_BY_HOST = (host) => "hostId:" + host,
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
  R_HOST_ID = "hostId",
  /*
  用于管理服务下的全部路径脚本
  zset
  srvJs:[服务ID] (无符号64位二进制键) [最后修改时间戳(秒)] → [路径] (字符串)
  */
  R_SRV_JS_PATH = key("srvJs:", (id) => u64Bin(id));
