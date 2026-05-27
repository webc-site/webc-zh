import { expect, test, afterAll } from "vitest";
import R from "../lib/R.js";
import init from "../api/init.js";

test("Redis 连接测试", async () => {
  const pingRes = await R.ping();
  expect(pingRes).toBe("PONG");

  await init();
});

afterAll(async () => {
  await R.quit();
});
