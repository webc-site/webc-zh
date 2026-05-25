import { env } from "node:process";

export default "//" + (env.GITHUB_ACTIONS ? "webc-zh.github.io" : "webc-zh.pages.dev") + "/";
