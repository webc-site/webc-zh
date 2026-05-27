import { expect, test, afterAll } from "vitest";
import R from "../lib/R.js";

test("Redis 连接测试", async () => {
  const result = await R.ping();
  expect(result).toBe("PONG");
});

afterAll(async () => {
  await R.quit();
});
