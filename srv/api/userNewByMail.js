import { R_USER_NAME, R_USER_ID } from "./R/USER.js";
import { R_USER_MAIL, R_ID_BY_MAIL } from "./R/MAIL.js";
import { R_HOST_ID, R_ID_BY_HOST, R_ID_HOST } from "./R/HOST.js";
import { MAIL_EXIST } from "./ERR.js";

export default async (redis, username, email) => {
  const at = email.lastIndexOf("@"),
    prefix = email.slice(0, at),
    host = email.slice(at + 1);

  let host_id = await redis.get(R_ID_BY_HOST(host));
  if (host_id) {
    const exist = await redis.get(R_ID_BY_MAIL(host_id, prefix));
    if (exist) {
      throw [MAIL_EXIST, Number(exist)];
    }
  }

  const id = await redis.incr(R_USER_ID),
    pipe = redis.pipeline();

  if (!host_id) {
    host_id = await redis.incr(R_HOST_ID);
    pipe.set(R_ID_BY_HOST(host), host_id).set(R_ID_HOST(host_id), host);
  }

  await pipe
    .set(R_ID_BY_MAIL(host_id, prefix), id)
    .set(R_USER_NAME(id), username)
    .set(R_USER_MAIL(id), email)
    .exec();

  return id;
};
