import { dirname, join, relative } from "node:path";
import yaml from "js-yaml";
import read from "@3-/read";

const ROOT = dirname(dirname(import.meta.dirname));

export default async (file_path, ai) => {
  const rules_path = join(ROOT, "fixJs.yml"),
    rules = yaml.load(read(rules_path)) || [];

  const content = read(file_path);
  if (!content) return false;

  const matched_rule = rules.find((rule) => {
    if (!rule.regex) return false;
    const re = new RegExp(rule.regex, "i");
    return content.split("\n").some((line) => re.test(line));
  });

  if (!matched_rule) {
    return false;
  }

  const prompt_text = matched_rule.prompt.trim() + "\n\n目标文件绝对路径：" + file_path;
  console.log("\n正在修复: " + relative(ROOT, file_path));

  // 直接让 opencode 修改文件
  await ai(prompt_text);
  return true;
};
