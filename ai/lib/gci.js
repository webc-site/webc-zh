import { existsSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { $, cd } from "zx";
import aiInit from "~/ai/lib/ai.js";
import ERR from "@3-/log/ERR.js";
import YELLOW, { yellow } from "@3-/log/YELLOW.js";
import CYAN from "@3-/log/CYAN.js";
import BLUE from "@3-/log/BLUE.js";
import GREEN from "@3-/log/GREEN.js";

export default async () => {
  let branch_name = "";
  try {
    branch_name = (await $`git symbolic-ref --short -q HEAD`).toString().trim();
  } catch {}

  const root_dir = (await $`git rev-parse --show-toplevel`).toString().trim();
  cd(root_dir);

  if (branch_name === "main") {
    await $`git checkout -b dev`;
    branch_name = "dev";
  }

  const count = async () => {
    let res_str = "0";
    try {
      res_str = (await $`git stash list | wc -l`).toString().trim();
    } catch {}
    return parseInt(res_str || "0", 10);
  };

  const stash_before = await count();

  try {
    await $`git pull --no-rebase --autostash origin dev`;
  } catch {}

  const stash_after = await count();

  if (stash_after > stash_before) {
    ERR("自动暂存恢复（autostash pop）失败，改动滞留在 stash@{0} 中：");
    $.verbose = true;
    await $`git stash show --stat stash@{0}`;
    $.verbose = false;
    console.log("请手动执行 `git stash apply` / `git stash drop` 处理后再进行 gci");
    process.exit(1);
  }

  if (existsSync(".husky/pre-commit")) {
    YELLOW("[提交前预处理]");
    $.verbose = true;
    await $`sh .husky/pre-commit`;
    $.verbose = false;
  }

  await $`git add .`;

  let has_changes = false;
  try {
    await $`git diff --cached --quiet`;
  } catch {
    has_changes = true;
  }

  if (!has_changes) {
    console.log("没有改动");
    process.exit(0);
  }

  await $`mkdir -p .tmp`;

  const repo_path = (await $`git config --get remote.origin.url`)
      .toString()
      .trim()
      .replace(/^(https?:\/\/[^/]+\/|.*@[^:]+:)/, "")
      .replace(/\.git$/, ""),
    diff_dir = "/tmp/" + repo_path,
    safe_branch = branch_name.replace(/\//g, "-"),
    diff_file = diff_dir + "/" + safe_branch + ".diff",
    msg_file = diff_file + ".msg";

  await $`rm -rf ${diff_dir}`;
  await $`mkdir -p ${diff_dir}`;

  process.on("exit", () => {
    rmSync(diff_dir, { recursive: true, force: true });
  });
  process.on("SIGINT", () => process.exit(0));

  await $`git diff ${branch_name} -- > ${diff_file}`;

  CYAN(root_dir);
  $.verbose = true;
  await $`cat ${diff_file}`;
  $.verbose = false;

  BLUE("[信息] 正在请求 Opencode SDK 自动生成提交消息...");

  const prompt_text =
    "根据以下代码改动，生成一句话的git提交消息，格式如<type>: <中文标题> / <English Subject>。不要返回其他多余的说明，仅返回提交消息即可。\n\n" +
    readFileSync(diff_file, "utf-8");

  await using ai = await aiInit("gci-commit");
  const msg_content = (await ai(prompt_text))?.trim();
  if (!msg_content) throw new Error("模型返回的提交消息为空");

  writeFileSync(msg_file, msg_content);

  GREEN("[成功] 提交消息已生成：\n" + yellow(msg_content));

  await $`git commit -F ${msg_file}`;

  await $`git log -n1`;
  await $`git push`;
};
