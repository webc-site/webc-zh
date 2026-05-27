import { expect, test, afterAll } from "vitest";
import R from "../lib/R.js";
import init from "../api/init.js";
import { idMail, mailId, R_ID_BY_MAIL, R_ID_MAIL } from "../api/R/MAIL.js";

test("MAIL 函数测试", async () => {
  await init();

  const prefix = "test_user",
    host = "example.com";
  const key_mail = R_ID_BY_MAIL(host, prefix);
  await R.del(key_mail, "{mail}Id");

  const id1 = await mailId(R, prefix, host);
  expect(id1).toBeDefined();
  expect(typeof id1).toBe("number");

  const id2 = await mailId(R, prefix, host);
  expect(id2).toEqual(id1);

  const savedMail = await R.get(R_ID_MAIL(id1));
  expect(savedMail).toBe(prefix + "@" + host);

  const mail_address = await idMail(R, id1);
  expect(mail_address).toBe(prefix + "@" + host);
});

afterAll(async () => {
  await R.quit();
});
