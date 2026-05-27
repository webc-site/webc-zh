import { R_USER_NAME, R_USER_MAIL, R_ID_BY_MAIL, R_USER_ID } from "./R/USER.js";
import { MAIL_EXIST } from "./ERR.js";

export default async (redis, username, email) => {
  const exist = await redis.get(R_ID_BY_MAIL(email));
  if (exist) {
    throw [MAIL_EXIST, Number(exist)];
  }

  const id = await redis.incr(R_USER_ID);

  await redis
    .pipeline()
    .set(R_ID_BY_MAIL(email), id)
    .set(R_USER_NAME(id), username)
    .set(R_USER_MAIL(id), email)
    .exec();

  return id;
};
