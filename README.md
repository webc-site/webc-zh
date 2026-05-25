# WebC.site

[组件库在线预览](https://webc-zh.pages.dev)

面向 AI 辅助开发设计的 Web Components 组件库与开发规范。

## 特性

- **跨框架**：基于原生 Web Components 构建，兼容 React、Vue、Svelte、Solid 等前端框架。
- **无样式**：逻辑与样式解耦，支持仅引入逻辑以自定义样式。
- **免构建与构建双模式**
  - **免构建（CDN 模式）**：在浏览器中直接通过 CDN 引用 JS 与 CSS 文件。
  - **构建模式（本地命令行）**：提供本地命令行工具，按需将组件源码集成至项目。
- **在线调试**：提供组件预览与“在线调试”入口，支持直接调试免构建组件。

## 快速上手

### 1. CDN 引入（免构建模式）

在免构建场景下，可通过 CDN 直接在浏览器中引用 JS 与 CSS 文件。

适用于无需开发环境配置、直接引用的轻量化场景。

以 `Scroll`（虚拟滚动条）组件为例：

#### 使用 jsdelivr

```html
<link href="//cdn.jsdelivr.net/npm/webc.site@0.1.35/Scroll.css" rel="stylesheet">
<script type="module">
  import "//cdn.jsdelivr.net/npm/webc.site@0.1.35/Scroll.js";
</script>
```

#### 使用 npmmirror（中国大陆镜像源）

```html
<link href="//registry.npmmirror.com/webc.site/0.1.35/files/Scroll.css" rel="stylesheet">
<script type="module">
  import "//registry.npmmirror.com/webc.site/0.1.35/files/Scroll.js";
</script>
```

> [!TIP]
> **自定义 CSS 变量（重写样式与替换背景资源）**
> 如需重写默认样式，可引用前缀为 `_` 的样式文件（该文件不包含 `var.css` 声明）：

```html
<link href="//cdn.jsdelivr.net/npm/webc.site@0.1.35/_Scroll.css" rel="stylesheet">
```

### 2. 构建模式

支持摇树优化与按需引入以减少构建体积，并支持静态资源优化（如 SVG 资源内联与去重）。

源码会直接下载至本地，便于直接修改源码二次开发。

例如添加 `Scroll`（虚拟滚动条）组件：

```bash
bunx webc.add Scroll
```

添加组件后，本地项目将生成以下目录结构与文件（使用只需导入 `lib/<组件名>.js` 即可，会自动引入组件下的 JS 与 CSS）：

| 路径                               | 说明                                           |
| :--------------------------------- | :--------------------------------------------- |
| `lib/<组件名>.js`                  | 组件入口文件                                   |
| `lib/<组件名>/`                    | 组件源码编译目录                               |
| `lib/<组件名>/index.js`            | 组件 JavaScript 逻辑文件                       |
| `lib/<组件名>/index.css`           | 组件 CSS 样式文件（Stylus 编译产物）           |
| `lib/css/`                         | 公共样式目录                                   |
| `lib/css/<样式名>.css`             | 公共 Stylus 样式编译出的 CSS（如 `reset.css`） |
| `lib/x/`                           | 依赖的公共基础模块目录（按需下载）             |
| `lib/x/<模块名>.js`                | 依赖的公共基础模块文件                         |
| `public/com/<组件名>/`             | 组件静态资源目录                               |
| `public/com/<组件名>/<资源名>.svg` | 组件引用的 SVG 静态资源                        |

### 3. SVG 资源优化

在 Vite 构建配置中，推荐配合使用 [vite-plugin-svg-var](https://www.npmjs.com/package/vite-plugin-svg-var) 插件优化 SVG 资源加载。

#### 核心功能

构建或开发阶段，插件在项目入口 JS（匹配 `/page/entry/**/*.js`）中注入 CSS 变量样式，并将 CSS/Stylus/Svelte 中引用的本地 SVG 路径（如 `url("/com/Scroll/cursor/grab.svg")`）自动替换为 `var(--grabSvg)` 形式，以减少网络请求。

#### 特性

- **UTF-8 编码**：将 SVG 转为 UTF-8 编码的 `data:image/svg+xml`（而不是 base64）并写入 CSS 变量，降低编码体积，提升压缩率。
- **内容去重**：内容相同的 SVG 文件仅生成单个 CSS 变量，避免资源冗余。
- **热更新**：监听 `public` 目录变动，在新增、修改或删除 SVG 文件时，重新计算 CSS 变量并触发热重载。

## 人工智能驱动开发

### 1. 状态与逻辑解耦

AI 通过自动化浏览器（如 Antigravity）进行开发与调试时，常因交互链路长、鉴权限制以及对后端数据的依赖而导致调试中断。

为提效，采用以下设计规范：

- **不调用后端**：组件内部不直接调用后端接口，数据交互均通过异步回调函数向外暴露。
- **数据模拟**：在 `Demo.svelte` 中传入模拟数据，以展现组件在多种状态下的交互表现，免除鉴权及后端环境依赖。

### 2. 组件架构与本地调试

组件采用独立目录结构，每个组件文件夹内包含其全部的逻辑、样式及静态资源（如 SVG）。

- **按需添加**：支持通过命令行独立拉取组件。
- **隔离调试**：执行以下命令，针对指定组件启动开发服务，调试入口为该组件目录下的 `Demo.svelte`：
  ```bash
  ./dev.sh com/<组件名>
  ```

### 3. Agent 提示词配置

开发提示词配置参见 [.agents/skills/com/SKILL.md](.agents/skills/com/SKILL.md)。在谷歌反重力（Antigravity）环境下，使用 `/com` 命令即可调用。

![](https://i-01.eu.org/1779351273.avif)

### 4. OpenCode 集成与 AI 提效脚本

项目在 **[bin](https://github.com/webc-site/webc-zh/tree/main/bin)** 目录下提供了可以直接在终端调用的命令行工具，并结合 **[ai](https://github.com/webc-site/webc-zh/tree/main/ai)** 目录下的 AI 提效工具实现自动化提效：

- **[bin/gci](https://github.com/webc-site/webc-zh/blob/main/bin/gci)**：自动生成提交信息并执行提交的 Git 工具。

#### svelteSvg.js

自动提取并优化 Svelte 模板中的内联 SVG 资源，防止源码因 AI 生成的内联 SVG 而臃肿。

##### 背景

人工智能在编写页面时，喜欢直接将 SVG 矢量图以内联方式写入 CSS。这会导致：

- Svelte 源码极度臃肿，严重降低代码可读性，浪费词元。
- 相同的 SVG 资源无法复用，无法进行静态资源去重。

##### 实现原理

在代码提交或通过 `bin/gci` 触发时运行 **[ai/svelteSvg.js](https://github.com/webc-site/webc-zh/blob/main/ai/svelteSvg.js)**：

1. **正则扫描**：匹配 Svelte 中的内联 SVG Data URI。
2. **AI 智能命名**：调用 LLM 自动根据 SVG 形状生成简短的小驼峰文件名（如 `search.svg`）。
3. **压缩与修复**：使用 SVGO 压缩 SVG 内容，压缩失败则调用 AI 自动修复语法错误。
4. **持久化与重写**：将 SVG 写入 `public/svg/` 目录，并重写模板中的内联路径为相对路径，再配合 `vite-plugin-svg-var` 转换为全局 CSS 变量引用。

#### xDoc.js

自动为 `x/` 目录下的公共基础模块生成和修订说明文档。

##### 核心功能

执行 **[ai/xDoc.js](https://github.com/webc-site/webc-zh/blob/main/ai/xDoc.js)** 进行文档自动化管理：

1. **导出提取**：使用 `oxc-parser` 静态解析 JS 代码，自动提取其导出的变量、函数及参数。
2. **动生 Schema**：根据提取出的导出结构，动态生成严密的 JSON Schema，限定 AI 响应的文档结构。
3. **校验与自愈**：结合 `ai.js` 接口与 OpenCode 对话，自动对返回的 JSON 执行空字段过滤与 Schema 校验，校验失败将错误反馈给 AI 进行重试修复（最多 3 次）。
4. **Markdown 渲染**：将验证通过的 JSON 结构渲染为符合 `SKILL.md` 规范的说明文档（`x/*.md`）。
5. **两级缓存**：使用 `.tmp/xDoc.msgpack` 缓存文件大小与修改时间做加速变更检测，配合 `.cache/xDoc.yml` 缓存文件 MD5 避免无修改文件重复调用 AI。

#### fixJs.js

自动根据规则库对检测到的 JavaScript 文件执行 AI 缺陷修复。

##### 核心功能

1. **导出单文件处理函数**：默认导出处理单个文件的异步函数 `fixSingle(file_path, ai)`。
2. **规则载入与匹配**：读取配置文件 **[fixJs.yml](https://github.com/webc-site/webc-zh/blob/main/fixJs.yml)**，若文件内容匹配定义的正则表达式，则通过 OpenCode API 及对应的提示词进行 AI 自动修复。
3. **脚本独立运行**：当直接运行 **[ai/fixJs.js](https://github.com/webc-site/webc-zh/blob/main/ai/fixJs.js)** 时，`import.meta.main` 为真，则通过 `gitLs` 扫描所有变更的 JS 文件，过滤并对匹配规则的文件执行自动修复并更新缓存。
4. **集成提交钩子**：在 **[sh/hook/js.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/js.js)** 中被调用，对当前暂存的 JS 文件执行增量修复。

## 样式

### 1. 默认样式

基础样式重置源文件为 **[styl/reset.styl](https://github.com/webc-site/webc-zh/blob/main/styl/reset.styl)**，编译产物为 `reset.css`。

基于 [UnoCSS Tailwind Compat Reset](https://github.com/unocss/unocss/blob/main/packages-presets/reset/tailwind-compat.md) 微调，引入 `18s` 字体库的 `t`/`c` 别名与字重，详见下文。

#### CDN 引入

##### jsdelivr

```html
<link href="//cdn.jsdelivr.net/npm/webc.site@0.1.35/reset.css" rel="stylesheet">
```

##### npmmirror (中国大陆镜像)

```html
<link href="//registry.npmmirror.com/webc.site/0.1.35/files/reset.css" rel="stylesheet">
```

### 2. 字体切片

为了优化网页端字体的一致性，在基础样式重置文件 **[styl/reset.styl](https://github.com/webc-site/webc-zh/blob/main/styl/reset.styl)** 中，引入 `18s` 映射表并配置全局字体的别名与可变字重：

```stylus
// 引入 18s 合并后的字体样式映射表
@import url('//registry.npmmirror.com/18s/0.2.16/files/_.css')

// 全局正文字体配置（思源黑体，别名 t 为 text 缩写，使用 font-variation-settings 精准配置可变字重）
html, :host
  font-family t, ui-sans-serif, ...
  font-variation-settings 'wght' 500

// 代码及等宽字体配置（JetBrains Mono，别名 c 为 code 缩写，同样配置可变字重）
code, kbd, samp, pre
  font-family c, ui-monospace, ...
  font-variation-settings 'wght' 400
```

该包使用了可变字重的字体，允许使用 CSS 的 `font-variation-settings` 属性对字重进行连续调节，例如 `font-variation-settings: "wght" 500`（关于可变字体的详细介绍与使用技巧，可参考 [MDN 可变字体指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) 以及 [MDN font-variation-settings 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variation-settings)）。

用 **[font-gen](https://github.com/webc-site/font-gen)** 构建，生成的字体在 **[font](https://github.com/webc-site/font)**。

### `t` （text）正文字体

思源黑体的可变字重版本。

为了优化中日韩（CJK）字体的加载体验，通过字体切片（分片）技术，将体积庞大的字体切分为 128KB 左右的 WOFF2 小分片。

### `c` （code）代码/等宽字体

JetBrains Mono 可变版本，专门针对阅读代码优化的等宽字体，内置常用编程连字与符号。

## 开发工具

### 1. 环境变量自动设置 - `mise`

项目使用 [mise](https://mise.jdx.dev/) 自动设置环境变量。配置文件 **[.mise.toml](https://github.com/webc-site/webc-zh/blob/main/.mise.toml)** 将 `bin` 目录加入到 `PATH`，并自动加载 `.env.sh` 环境变量。

### 2. 代码提交钩子

项目集成了 [Husky](https://typicode.github.io/husky/) 与 [lint-staged](https://github.com/okonet/lint-staged)，在提交代码时会自动触发校验、格式化以及资源优化，确保代码质量并减少包体积。

#### 触发流程

在提交代码时，[.husky/pre-commit](https://github.com/webc-site/webc-zh/blob/main/.husky/pre-commit) 钩子会按以下顺序执行：

1. **全局校验与扫描**：执行 [sh/hook/fmt.sh](https://github.com/webc-site/webc-zh/blob/main/sh/hook/fmt.sh) 进行全量代码格式化与死代码扫描。
2. **暂存文件优化**：执行 `lint-staged` 对暂存区文件根据后缀名分别调用针对性的优化脚本（配置见 [package.json](https://github.com/webc-site/webc-zh/blob/main/package.json) 中的 `lint-staged` 部分）。
3. **自动更新暂存区**：如果环境变量 `$S` 未设置，脚本会自动运行 `git add -u` 将格式化和优化后的最新修改加入暂存区，保证提交内容的一致性。

#### 钩子脚本与功能介绍

##### 格式校验

[sh/hook/fmt.sh](https://github.com/webc-site/webc-zh/blob/main/sh/hook/fmt.sh)

- **`oxfmt`**：使用 Rust 编写的高性能格式化工具快速美化代码。
- **`oxlint --fix`**：使用高性能校验工具扫描并自动修复可修复的 JavaScript 代码问题。
- **`knip-bun`**：分析并输出未使用的文件、导出项和依赖，辅助代码瘦身。

##### 优化代码

- `**/*.svg` — [sh/hook/svg.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/svg.js)
  对暂存的 SVG 矢量图进行压缩与规范化（使用 SVGO 引擎），删除多余元数据并精简路径，减小文件体积。
- `**/*.svelte` — [sh/hook/svelte.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/svelte.js)
  1. **自动修正导入路径**：调用 [importFix.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/importFix.js) 将所有相对导入路径（如 `./`、`../`）统一重写为项目绝对别名（如 `~/` 或 `x/`）。
  2. **格式化校验**：使用 `fmt_svelte` 进行格式化，若包含语法或结构错误将拒绝提交。
  3. **SVG 内联压缩**：通过 [svelteSvgMinify.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/svelteSvgMinify.js) 自动压缩 Svelte 模板中包含的内联 SVG 标签和样式中引用的编码数据。
- `**/*.styl` — [sh/hook/styl.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/styl.js)
  1. **自动修正引入路径**：重写 `@import` 中的相对路径。
  2. **代码格式化**：调用 `stylus-supremacy` 配合项目根目录的 [supremacy.yml](https://github.com/webc-site/webc-zh/blob/main/supremacy.yml) 对 Stylus 样式代码进行格式化。
- `**/*.js` — [sh/hook/js.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/js.js)
  1. **自动修正导入路径**：调用 [importFix.js](https://github.com/webc-site/webc-zh/blob/main/sh/hook/importFix.js) 统一重写 JS 文件中的相对导入路径。
  2. **缺陷自动修复**：对匹配 **[fixJs.yml](https://github.com/webc-site/webc-zh/blob/main/fixJs.yml)** 规则的 JS 文件，调用 **[ai/fixJs.js](https://github.com/webc-site/webc-zh/blob/main/ai/fixJs.js)** 进行 AI 自动修复。
