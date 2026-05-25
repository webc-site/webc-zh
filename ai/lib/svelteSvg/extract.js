import { join } from "node:path";
import read from "@3-/read";
import write from "@3-/write";
import svgName from "~/ai/lib/svelteSvg/svgName.js";
import fixSvg from "~/ai/lib/svelteSvg/fixSvg.js";
import svgMinify from "~/vite/lib/svgMinify.js";

const decodeSvgData = (data_uri) => {
  const comma_idx = data_uri.indexOf(",");
  if (comma_idx === -1) {
    return null;
  }
  const meta = data_uri.slice(0, comma_idx),
    raw_data = data_uri.slice(comma_idx + 1);
  if (meta.includes("base64")) {
    return Buffer.from(raw_data, "base64").toString("utf-8");
  }
  try {
    return decodeURIComponent(raw_data);
  } catch {
    return raw_data;
  }
};

export default async (ai_prompt, svelte_path, svg_dir) => {
  let content = read(svelte_path);
  if (!content) {
    return;
  }

  const regex =
      /url\(\s*(?:['"](data:image\/svg\+xml[\s\S]*?)['"]|((?:data:image\/svg\+xml)[^\s)]+))\s*\)/gi,
    uris = new Set();
  for (const m of content.matchAll(regex)) {
    uris.add(m[1] || m[2]);
  }

  if (uris.size === 0) {
    return;
  }

  const org = content;
  for (const uri of uris) {
    const svg_code = decodeSvgData(uri);
    if (!svg_code) {
      continue;
    }

    console.log("发现嵌入的 SVG，文件: " + svelte_path);
    const name = await svgName(ai_prompt, svelte_path, svg_code, svg_dir);
    if (!name) {
      console.error("生成 SVG 文件名失败，跳过该 SVG。");
      continue;
    }
    console.log("建议的文件名: " + name);

    let minified = "",
      min_failed = false;
    try {
      minified = svgMinify(svg_code);
    } catch {
      min_failed = true;
    }

    if (min_failed) {
      console.log("SVG 压缩失败，正在请求 AI 修复 SVG...");
      const fixed_svg = await fixSvg(ai_prompt, svg_code);
      if (fixed_svg) {
        try {
          minified = svgMinify(fixed_svg);
        } catch {
          minified = fixed_svg;
        }
      } else {
        minified = svg_code;
      }
    }

    const to = join(svg_dir, name);
    write(to, minified);
    console.log("已保存: " + to);

    content = content.replaceAll(uri, "/svg/" + name);
  }

  if (content !== org) {
    write(svelte_path, content);
    console.log("已更新文件: " + svelte_path);
  }
};
