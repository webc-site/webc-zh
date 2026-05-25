#!/usr/bin/env bun
import { Eta } from "eta";
import read from "@3-/read";
import path from "node:path";
import write from "@3-/write";

const dir = import.meta.dirname,
  template_path = path.join(dir, "comCss.md"),
  com_path = path.join(dir, "com", "SKILL.md"),
  css_path = path.join(dir, "css", "SKILL.md"),
  eta = new Eta({ autoTrim: false }),
  template = read(template_path),
  com_content = eta.renderString(template, { name: "com 组件开发", isCom: true }),
  css_content = eta.renderString(template, { name: "css 样式开发", isCom: false });

write(com_path, com_content);
write(css_path, css_content);
