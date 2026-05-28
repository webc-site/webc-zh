# 优化加载性能

封装 rust 的 size lru
把请求 url 的代码、wasm 缓存到进程内
订阅 publish 接受更新
publish 单独一个 ioredis 链接
publish 断开自动重连，再次连上的时候，清空缓存

https://www.npmjs.com/package/@3-/lru#zh

# 动态请求支持 wasm （在优化加载性能之后实现，要缓存）
