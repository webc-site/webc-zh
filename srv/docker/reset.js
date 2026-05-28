#!/usr/bin/env bun

import { rm } from "node:fs/promises";
import { join } from "node:path";
import { parseEnv } from "node:util";
import { RedisClient } from "bun";
import sleep from "@3-/sleep";
import ERR from "@3-/log/ERR.js";
import down from "./down.js";
import up from "./up.js";

const ready = async (port, password) => {
    let client = null;
    try {
      client = new RedisClient("redis://:" + password + "@127.0.0.1:" + port);
      const timeout = async () => {
        await sleep(1500);
        throw new Error("Timeout");
      };
      await Promise.race([client.connect(), timeout()]);
      const res = await client.ping();
      if (res === "PONG") {
        return true;
      }
    } catch {
      // 忽略连接错误，以便重试
    } finally {
      if (client) {
        try {
          client.close();
        } catch {}
      }
    }
    return false;
  },
  restart = async () => {
    console.log("正在停止容器...");
    await down();

    const data_path = join(import.meta.dirname, "data");
    await rm(data_path, { recursive: true, force: true });
    console.log("已删除数据目录: " + data_path);

    console.log("正在启动容器...");
    await up();
  },
  wait = async (port, password) => {
    const start_time = Date.now();
    while (Date.now() - start_time < 10000) {
      const elapsed = Math.round((Date.now() - start_time) / 1000);
      console.log("检测 Redis... (" + elapsed + "s)");
      if (await ready(port, password)) {
        console.log("Redis 已就绪！");
        return true;
      }
      await sleep(1000);
    }
    return false;
  },
  main = async () => {
    const env_path = join(import.meta.dirname, ".env"),
      env = parseEnv(await Bun.file(env_path).text()),
      port = +env.PORT || 9050;

    await restart();

    const is_connected = await wait(port, env.PASSWORD);

    if (is_connected) {
      console.log("正在导入并运行 init.js...");
      const init = (await import("../api/init.js")).default;
      await init();
      console.log("初始化完成。");
      process.exit(0);
    } else {
      ERR("Redis 未能在 10 秒内就绪。");
      process.exit(1);
    }
  };

export default main;

if (import.meta.main) {
  await main();
}
