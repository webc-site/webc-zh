import { clean, validate } from "~/ai/xDoc/validate.js";

export default async (runAi, item, schema, existing_doc) => {
  let prompt_text =
    "你是一个专业的开发文档编写助手。请根据以下 JavaScript 代码，生成或修订其对应的文档。\n\n" +
    "【输入信息】\n" +
    "- 文件路径: " +
    item.file +
    "\n" +
    (existing_doc
      ? "- 现有文档路径: " +
        item.file.replace(/\.js$/, ".md") +
        "\n- 现有文档内容:\n```markdown\n" +
        existing_doc +
        "\n```\n"
      : "- 该文件目前没有现有文档，请全新生成。\n") +
    "- 待解析 JavaScript 代码:\n" +
    "```javascript\n" +
    item.code +
    "\n" +
    "```\n\n" +
    "【文档生成规则】\n" +
    "1. 请只在 JSON 代码块中返回你的文档结果，格式为：\n" +
    "```json\n" +
    "{\n" +
    "  ...\n" +
    "}\n" +
    "```\n" +
    "2. 你的 JSON 结果必须严格符合以下 JSON Schema:\n" +
    "```json\n" +
    JSON.stringify(schema, null, 2) +
    "\n" +
    "```\n" +
    '3. 极其重要：对于 JSON Schema 中的可选字段（如 "return" 或 "exception"），如果该函数没有返回值或没有异常，请绝对不要输出这些字段（不要输出为 null 或空字符串，而是直接不包含这个 key）。\n' +
    '4. 所有的描述（"title"、"description"、"params" 的各项、"return"、"exception"）都应该非常简练、准确，不使用任何客套话 and 形容词，直接说明用途。\n';

  for (let attempt = 0; attempt < 3; ++attempt) {
    if (attempt > 0) {
      console.log("重试 " + attempt + "...");
    }
    const reply = await runAi(prompt_text),
      start = reply.indexOf("{"),
      end = reply.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      prompt_text = "你的回复没有包含 JSON 代码块。请提供格式符合定义的 JSON 代码块。";
      continue;
    }

    const json_str = reply.slice(start, end + 1);
    let parsed;
    try {
      parsed = JSON.parse(json_str);
    } catch (e) {
      prompt_text =
        "无效的 JSON 格式。请确保你返回的是符合 JSON 语法的合法对象。原报错: " + e.message;
      continue;
    }

    const cleaned = clean(parsed);
    if (!cleaned) {
      prompt_text = "解析后得到的对象为空，请生成有效的文档字段。";
      continue;
    }

    const errors = validate(cleaned, schema);
    if (errors.length > 0) {
      prompt_text = "校验失败。存在以下错误，请修复后重新生成：\n" + errors.join("\n");
      continue;
    }

    return cleaned;
  }
  return null;
};
