import { expect, test, beforeAll, afterAll } from "vitest";
import { join } from "node:path";
import { spawn } from "node:child_process";
import isPortReachable from "is-port-reachable";
import { pack } from "msgpackr";
import R from "../src/conn/R.js";
import { R_JS, R_HOST } from "../src/R.js";
import SRV from "../sh/const/SRV.js";
import { HOST, PORT } from "../conf/workerd/CONF.js";
import COMPATIBILITY_DATE from "../conf/workerd/compatibilityDate.js";
import { COMPATIBILITY_DATE as FLAG_COMPATIBILITY_DATE } from "../src/const/WORKER/FLAG.js";
import u64Bin from "@3-/intbin/u64Bin.js";

const srv_id = 1,
  rand = Math.floor(Math.random() * 1e6),
  TXT = "Hello from dynamic worker! " + rand,
  host_key = R_HOST(HOST),
  key = R_JS(srv_id, String(rand)),
  code = "export default {\n  async fetch(req) {\n return new Response('" + TXT + "');\n  }\n};",
  val = pack([code, [FLAG_COMPATIBILITY_DATE, COMPATIBILITY_DATE]]),
  sh = join(SRV, "sh/workerd.sh");

let child;

beforeAll(async () => {
  await R.pipeline()
    .set(host_key, Buffer.from(u64Bin(srv_id)))
    .set(key, val)
    .exec();
  const open = await isPortReachable(PORT, { host: HOST });
  if (!open) {
    child = spawn(sh);
    child.on("error", () => {});
    let retries = 50;
    while (retries-- > 0 && !(await isPortReachable(PORT, { host: HOST }))) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
});

test("测试请求 url 与加载", async () => {
  const res = await fetch("http://" + HOST + ":" + PORT + "/" + rand);
  if (res.status !== 200) {
    console.error("Test failed, body:", await res.text());
  }
  expect(res.status).toBe(200);
  expect(await res.text()).toBe(TXT);
});

afterAll(async () => {
  await R.pipeline().del(host_key).del(key).exec();
  await R.quit();
  if (child) {
    child.kill("SIGTERM");
  }
});
