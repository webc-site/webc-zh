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
