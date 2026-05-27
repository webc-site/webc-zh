import { join } from "node:path";

export default async (ai_prompt, path, svg_code, dir) => {
  let prompt =
    "Svelte 文件路径: " +
    path +
    "\nSVG 代码:\n" +
    svg_code +
    '\n\n请为这个 SVG 文件生成一个文件名。\n文件名必须遵循以下严格规则：\n1. 必须使用小驼峰命名法（首字母小写，例如 search.svg、arrowRight.svg）。\n2. 必须以 \'.svg\' 结尾。\n3. 必须是纯英文。\n4. 名字要简洁，尽量用单个单词。\n5. 输出格式必须是 JSON 字符串，格式为：{"name": "生成的名称.svg"}。\n请不要包含任何其他多余文本，只返回该 JSON 代码块。';

  for (let i = 0; i < 3; ++i) {
    const reply = await ai_prompt(prompt),
      match = reply.match(/\{[\s\S]*?\}/);

    if (!match) {
      prompt =
        '你的回复没有包含有效的 JSON 代码块。请提供格式为 {"name": "文件名.svg"} 的 JSON 代码块。';
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      prompt = '无效的 JSON。请输出格式为 {"name": "文件名.svg"} 的有效 JSON 对象。';
      continue;
    }

    const { name } = parsed;
    if (!name || !name.endsWith(".svg")) {
      prompt = '文件名必须以 \'.svg\' 结尾。请输出格式为 {"name": "文件名.svg"} 的 JSON 对象。';
      continue;
    }

    const to = join(dir, name);
    if (await Bun.file(to).exists()) {
      prompt = "文件名 '" + name + "' 已经在 public/svg/ 下存在，请换一个不重名的文件名。";
      continue;
    }

    return name;
  }
  return null;
};
