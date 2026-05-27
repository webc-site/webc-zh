import { expect, test, afterAll } from "vitest";
import R from "../src/conn/R.js";
import { R_SRV } from "../src/R.js";

test("Redis 连接测试", async () => {
  const result = await R.ping();
  expect(result).toBe("PONG");
  expect(R_SRV(1)).toBeDefined();
});

afterAll(async () => {
  await R.quit();
});
