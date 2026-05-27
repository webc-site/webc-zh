import key from "../../lib/key.js";
import u64Bin from "@3-/intbin/u64Bin.js";

/*
用于生成唯一的组织ID
string
orgId 自增组织ID计数器 (数值)
*/
export const R_ORG_ID = "orgId",
  /*
  生成唯一的组织ID (偶数)
  */
  orgId = (redis) => redis.incrby(R_ORG_ID, 2),
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
  用于根据组织名查找组织ID
  string
  orgId:[组织名] → 组织ID (数值)
  */
  R_ID_BY_ORG = (name) => "orgId:" + name,
  /*
  用于根据组织ID查找组织名
  string
  org:[组织ID] → 组织名 (字符串)
  */
  R_ORG = key("org:", (org_id) => u64Bin(org_id)),
  /*
  用于查询用户所在的组织列表
  zset
  userOrg:[用户ID] [最后访问时间戳(秒)] → [组织ID] (数值)
  */
  R_USER_ORG = key("userOrg:", (uid) => u64Bin(uid));
