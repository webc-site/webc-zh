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
import { ORG_EXIST, MAIL_EXIST } from "../api/ERR.js";
import srvNew from "../api/srvNew.js";
import srvName from "../api/srvName.js";
import srvJsSet from "../api/srvJsSet.js";
import orgSrv from "../api/orgSrv.js";
import orgUser from "../api/orgUser.js";
import userOrg from "../api/userOrg.js";
import orgUserAdd from "../api/orgUserAdd.js";
import orgNew from "../api/orgNew.js";
import userNewByMail from "../api/userNewByMail.js";
import { OWNER } from "../api/const/ORG_USER_ROLE.js";
import { R_SRV_NAME_ID, R_ID_SRV, R_SRV_ORG_ID, R_SRV_JS_PATH } from "../api/R/SRV.js";
import { R_ORG_SRV_ID, R_ORG_USER, R_ID_BY_ORG, R_ORG, R_USER_ORG } from "../api/R/ORG.js";
import { R_USER_NAME, R_USER_MAIL, R_ID_BY_MAIL } from "../api/R/USER.js";

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

test("测试创建组织及重名拦截", async () => {
  const org_name = "test-org-" + UUID,
    uid = 6666;

  // 创建新组织
  const org_id = await orgNew(R, uid, org_name);
  expect(org_id).toBeGreaterThan(0);

  // 验证用户被正确绑定为 OWNER
  const users = await orgUser(R, org_id);
  expect(users).toContainEqual([uid, OWNER]);

  const orgs = await userOrg(R, uid);
  expect(orgs).toContain(org_id);

  // 验证重名拦截
  await expect(orgNew(R, uid, org_name)).rejects.toEqual([ORG_EXIST, org_id]);

  // 清理
  await R.pipeline()
    .del(R_ID_BY_ORG(org_name))
    .del(R_ORG(org_id))
    .del(R_ORG_USER(org_id))
    .del(R_USER_ORG(uid))
    .exec();
});

test("测试根据邮箱创建用户及邮箱重名拦截", async () => {
  const username = "test-user-" + UUID,
    email = UUID + "@example.com";

  // 创建新用户
  const uid = await userNewByMail(R, username, email);
  expect(uid).toBeGreaterThan(0);

  // 验证重名拦截
  await expect(userNewByMail(R, username, email)).rejects.toEqual([MAIL_EXIST, uid]);

  // 清理
  await R.pipeline().del(R_ID_BY_MAIL(email)).del(R_USER_NAME(uid)).del(R_USER_MAIL(uid)).exec();
});

afterAll(async () => {
  await R.pipeline().del(HOST_KEY).del(R_JS(SRV_ID, UUID)).del(R_SRV_JS_PATH(SRV_ID)).exec();
  await R.quit();
  if (child) {
    child.kill("SIGKILL");
  }
});
