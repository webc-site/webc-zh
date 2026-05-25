export default async (ai_prompt, svg_code) => {
  let prompt =
    "SVG 压缩失败，SVG 代码可能格式错误或无效：\n" +
    svg_code +
    '\n\n请修复该 SVG 代码，并在 JSON 代码块中返回修复后的 SVG，格式为：\n{\n  "svg": "<svg>...</svg>"\n}\n只返回该 JSON 代码块，并确保它是有效的 JSON。';

  for (let i = 0; i < 3; ++i) {
    const reply = await ai_prompt(prompt),
      match = reply.match(/\{[\s\S]*?\}/);

    if (!match) {
      prompt =
        '你的回复没有包含 JSON 代码块。请提供格式为 {"svg": "<svg>...</svg>"} 的 JSON 代码块。';
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      prompt = '无效的 JSON。请输出格式为 {"svg": "<svg>...</svg>"} 的有效 JSON 对象。';
      continue;
    }

    const { svg } = parsed;
    if (svg) {
      return svg;
    }
    prompt = "请在 'svg' 键下提供修复后的 SVG 代码。";
  }
  return null;
};
