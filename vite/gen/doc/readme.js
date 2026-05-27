import { existsSync } from "node:fs";
import read from "@3-/read";
import save from "~/vite/gen/doc/save.js";

const genReadme = (path) => {
  if (existsSync(path)) {
    let deleted = false;
    const readme = read(path),
      lines = readme.split("\n").filter((line) => {
        if (!deleted && line.startsWith("[") && line.endsWith(")")) {
          if (line.indexOf("[") == line.lastIndexOf("[")) {
            deleted = true; // 过滤第一个以 [ 开头且以 ) 结尾的行（移除预览链接）
            return false;
          }
        }
        return true;
      }),
      title = (lines[0] || "").replace(/^#\s*/, "").trim();

    let in_code = false,
      current_section = null;
    const sections = [];

    for (const line of lines) {
      if (line.startsWith("```")) {
        in_code = !in_code;
      }

      let is_heading = false;
      if (!in_code) {
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          is_heading = true;
          if (current_section) {
            sections.push([
              current_section.level,
              current_section.title,
              current_section.body_lines.join("\n").trim(),
            ]);
          }
          current_section = {
            level: match[1].length,
            title: match[2].replace(/`/g, "").trim(),
            body_lines: [],
          };
        }
      }

      if (!is_heading) {
        if (current_section) {
          current_section.body_lines.push(line);
        } else {
          current_section = {
            level: 1,
            title: title,
            body_lines: [line],
          };
        }
      }
    }

    if (current_section) {
      sections.push([
        current_section.level,
        current_section.title,
        current_section.body_lines.join("\n").trim(),
      ]);
    }

    save("readme.js", JSON.stringify(sections));
  }
};

export default genReadme;
