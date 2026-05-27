import { expect, test, beforeAll, afterAll } from "vitest";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import isPortReachable from "is-port-reachable";
import { pack } from "msgpackr";
import R from "../src/conn/R.js";
import { R_JS, R_HOST, R_SRV_ID_INCR } from "../src/R.js";
import SRV from "../sh/const/SRV.js";
import { PORT } from "../conf/workerd/CONF.js";
import COMPATIBILITY_DATE from "../conf/workerd/compatibilityDate.js";
import { COMPATIBILITY_DATE as FLAG_COMPATIBILITY_DATE } from "../src/const/WORKER/FLAG.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import ERR from "@3-/log/ERR.js";

const UUID = randomUUID(),
  TXT = "Hello from dynamic worker! " + UUID,
  HOST_KEY = R_HOST("127.0.0.1"),
  CODE = "export default {\n  async fetch(req) {\n return new Response('" + TXT + "');\n  }\n};",
  VAL = pack([CODE, [FLAG_COMPATIBILITY_DATE, COMPATIBILITY_DATE]]),
  SH = join(SRV, "sh/workerd.sh");

let child, SRV_ID, KEY;

beforeAll(async () => {
  SRV_ID = await R.incr(R_SRV_ID_INCR);
  KEY = R_JS(SRV_ID, UUID);

  await R.pipeline()
    .setex(HOST_KEY, 600, Buffer.from(u64Bin(SRV_ID)))
    .setex(KEY, 600, VAL)
    .exec();
  const open = await isPortReachable(PORT, { host: "127.0.0.1" });
  if (!open) {
    child = spawn(SH);
    child.on("error", () => {});
    let retries = 50;
    while (retries-- > 0 && !(await isPortReachable(PORT, { host: "127.0.0.1" }))) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
});

test("测试请求 url 与加载", async () => {
  const res = await fetch("http://127.0.0.1:" + PORT + "/" + UUID);
  if (res.status !== 200) {
    ERR("Test failed, body:", await res.text());
  }
  expect(res.status).toBe(200);
  expect(await res.text()).toBe(TXT);
});

afterAll(async () => {
  await R.pipeline().del(HOST_KEY).del(KEY).exec();
  await R.quit();
  if (child) {
    child.kill("SIGTERM");
  }
});
