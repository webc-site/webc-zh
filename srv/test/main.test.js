import { expect, test, beforeAll, afterAll } from "vitest";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import isPortReachable from "is-port-reachable";
import R from "../lib/R.js";
import { R_JS, R_HOST_SRV, R_SRV_ID } from "../src/R.js";
import SRV from "../sh/const/SRV.js";
import { PORT } from "../conf/workerd/CONF.js";
import COMPATIBILITY_DATE from "../conf/workerd/compatibilityDate.js";
import u64Bin from "@3-/intbin/u64Bin.js";
import ERR from "@3-/log/ERR.js";
import srvNew from "../api/srvNew.js";
import srvName from "../api/srvName.js";
import srvJsSet from "../api/srvJsSet.js";
import orgSrv from "../api/orgSrv.js";
import orgUser from "../api/orgUser.js";
import userOrg from "../api/userOrg.js";
import orgUserAdd from "../api/orgUserAdd.js";
import { OWNER } from "../api/const/ORG_USER_ROLE.js";
import {
  R_SRV_NAME_ID,
  R_ID_SRV,
  R_SRV_ORG_ID,
  R_SRV_JS_PATH,
  R_ORG_SRV_ID,
  R_ORG_USER,
  R_USER_ORG,
} from "../api/R.js";

const UUID = randomUUID(),
  TXT = "Hello from dynamic worker! " + UUID,
  HOST_KEY = R_HOST_SRV("127.0.0.1"),
  CODE = "export default {\n  async fetch(req) {\n return new Response('" + TXT + "');\n  }\n};",
  SH = join(SRV, "sh/workerd.sh");

let child, SRV_ID;

beforeAll(async () => {
  SRV_ID = await R.incr(R_SRV_ID);

  await R.pipeline()
    .setex(HOST_KEY, 600, Buffer.from(u64Bin(SRV_ID)))
    .exec();
  await srvJsSet(R, SRV_ID, UUID, CODE, COMPATIBILITY_DATE, 600);

  let open = await isPortReachable(PORT, { host: "127.0.0.1" });
  if (open) {
    try {
      const { execSync } = await import("node:child_process");
      execSync("killall workerd || true");
    } catch {}
    let retries = 50;
    while (retries-- > 0 && (await isPortReachable(PORT, { host: "127.0.0.1" }))) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  child = spawn(SH, { stdio: "inherit" });
  child.on("error", () => {});
  let retries = 50;
  while (retries-- > 0 && !(await isPortReachable(PORT, { host: "127.0.0.1" }))) {
    await new Promise((r) => setTimeout(r, 100));
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

test("测试根据 ID 创建服务与反查", async () => {
  const name = "test-srv-" + UUID,
    id = await srvNew(R, 9999, name),
    fetched_name = await srvName(R, id),
    srvs = await orgSrv(R, 9999);

  expect(id).toBeGreaterThan(0);
  expect(fetched_name).toBe(name);
  expect(srvs.some(([srv_id, srv_name]) => srv_id === id && srv_name === name)).toBe(true);

  // 清理
  await R.pipeline()
    .del(R_SRV_NAME_ID(name))
    .del(R_ID_SRV(id))
    .del(R_SRV_ORG_ID(id))
    .zrem(R_ORG_SRV_ID(9999), id)
    .exec();
});

test("测试组织与成员角色关系以及用户所属组织列表", async () => {
  const org_id = 8888,
    uid = 7777,
    role = OWNER;

  // 使用新 API 写入
  await orgUserAdd(R, org_id, uid, role);

  const users = await orgUser(R, org_id),
    orgs = await userOrg(R, uid);

  expect(users).toContainEqual([uid, role]);
  expect(orgs).toContain(org_id);

  // 清理
  await R.pipeline().del(R_ORG_USER(org_id)).del(R_USER_ORG(uid)).exec();
});

afterAll(async () => {
  await R.pipeline().del(HOST_KEY).del(R_JS(SRV_ID, UUID)).del(R_SRV_JS_PATH(SRV_ID)).exec();
  await R.quit();
  if (child) {
    child.kill("SIGKILL");
  }
});
