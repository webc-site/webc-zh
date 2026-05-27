# Webc Server (srv)

## 默认请求限制与资源配额

在 `workerd` (Cloudflare Workers) 默认配置下，每个请求的资源限制如下：

### 1. 时间限制

- **CPU 时间限制 (CPU Time Limit)**：**50 毫秒 (ms)**。
  - **定义**：仅计算 CPU 实际执行 JavaScript 代码的时间，不包括网络 I/O 等待时间。
  - **超时后果**：超出后将抛出 CPU 限制超限异常并终止请求。
- **实际墙钟时间 (Wall-clock Time)**：**无硬性限制**（通常受外部 HTTP 连接超时限制，如 30 秒或客户端超时）。只要不占用 CPU，等待异步 I/O (如 `fetch`、`await`) 不计入 50ms 限制。

### 2. 数量与大小限制

- **子请求限制 (Subrequests Limit)**：最多 **50 个**（如内部 `fetch()` 其它接口）。
- **内存限制 (Memory Limit)**：单个 Isolate 默认限制为 **128 MB**。
- **请求体大小 (Request Body Size)**：默认最大支持 **100 MB**。

## 数据关系与 Redis Key 设计

数据分为四类主体：**用户 (User)**、**组织 (Org)**、**服务 (Service)**、**域名 (Host)**。

### 1. 用户 (User)

- 用户所在的组织列表：
  - `userOrg:[用户ID]` $\rightarrow$ 组织ID列表 (ZSet, 按访问时间戳排序)
- 组织下的成员用户及其角色：
  - `orgUser:[组织ID]` $\rightarrow$ 用户ID $\rightarrow$ 身份角色 (HSet, `u64Bin(uid)` $\rightarrow$ `u64Bin(role)`)

### 2. 组织 (Org)

- 组织拥有的全部服务：
  - `orgSrv:[组织ID]` $\rightarrow$ 服务ID列表 (ZSet, 按创建时间戳排序)
- 组织拥有的全部域名：
  - `orgHost:[组织ID]` $\rightarrow$ 域名ID列表 (ZSet, 按绑定时间戳排序)

### 3. 服务 (Service)

- 服务名与 ID 互查：
  - `srv:[服务名]` $\rightarrow$ 服务ID (`u64Bin` 二进制)
  - `idSrv:[服务ID]` $\rightarrow$ 服务名 (字符串)
- 服务所属组织：
  - `srvOrg:[服务ID]` $\rightarrow$ 组织ID (数字)
- 服务绑定的全部域名：
  - `srvHost:[服务ID]` $\rightarrow$ 域名ID列表 (ZSet, 按绑定时间戳排序)
- 服务拥有的 Worker 脚本路径列表：
  - `srvJs:[服务ID]` $\rightarrow$ 路径列表 (ZSet, 按更新时间戳排序)
- 路径对应的脚本内容与配置 (MsgPack)：
  - `js:[服务ID]:[路径]` $\rightarrow$ `[代码, 兼容日期等配置]`
- 服务自增 ID 计数器：
  - `srvId` $\rightarrow$ 自增数字

### 4. 域名 (Host)

- 域名与 ID 互查：
  - `hostId:[域名]` $\rightarrow$ 域名ID (数字)
  - `idHost:[域名ID]` $\rightarrow$ 域名 (字符串)
- 域名路由 (运行时解析)：
  - `host:[域名]` $\rightarrow$ 服务ID (`u64Bin` 二进制)
- 域名自增 ID 计数器：
  - `idHost` $\rightarrow$ 自增数字

### 5. 代码模块分工

- `lib/R.js`: 提供 Redis 连接实例。
- `api/R.js`: 提供管理后台 (CLI / API) 使用的 Redis Key 生成器（如 `srvOrg`、`orgHost`、`orgUser` 等）。
- `src/R.js`: 提供运行时路由与脚本加载使用的 Redis Key 生成器（如 `host:[域名]`、`js:[服务ID]:[路径]` 等）。
