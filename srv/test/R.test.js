import { expect, test, afterAll } from "vitest";
import R from "../lib/R.js";
import { R_SRV_JS_PATH } from "../api/R/SRV.js";

test("Redis 连接测试", async () => {
  const result = await R.ping();
  expect(result).toBe("PONG");
  expect(R_SRV_JS_PATH(1)).toBeDefined();
});

afterAll(async () => {
  await R.quit();
});
