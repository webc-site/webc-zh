---
name: css 样式开发
---

1. 运行 `./newCom.sh 项目名 `，项目名首字母大写
   这会在 com 目录下面，创建新的项目文件夹
2. 阅读 `./doc/code` 下文档，学习开发规范，在项目同名的 .styl 文件中开发组件样式的纯 css。组件样式，遵循苹果 Liquid Glass 视觉规范、设计美学（毛玻璃、悬浮、胶囊气泡）。
   如果依赖于 com/ 下的其他组件，用相对路径，在"var.styl" 中引入其他组件的 styl。
3. 组件自带的静态资源（如 SVG 图片、cursor 光标图标等）必须放在组件目录下独立的文件夹中（如 `svg/`、`cursor/`）。
   静态资源的引用（如 SVG）必须全部使用 CSS 变量，变量名采用小写驼峰风格并以 `Svg` 作为后缀（例如 `--waitSvg`）。
   变量定义统一放在组件目录下的 `var.styl` 中，其他样式写到`项目名.styl` 中。`styl`（不 import var.styl） 之间不相互引用（在下面 Demo.svelte 中同时导入）。
4. 在项目目录下的 `Demo.svelte` 中，展示组件。
   如果组件有多重状态（比如：加载中(用不结束的 Promise 实现)、空数据、有数据等等），同时展示所有状态，每种状态配上标题描述，加上切换显示此状态使用的实际数据的标签。
   避免为了样式写标签嵌套，善用 before、after 、多重背景等现代 css 特性来实现样式
5. 运行 `./com.js` 编译，然后运行 `./sh/fmt.sh`，并修复报警
6. 按 @.agents/skills/code\*review/SKILL.md 要求优化
7. 重复 5 - 6，确保没问题
8. 运行 `./comDev.sh ./com/ProjectName`， 打开浏览器访问 `http://127.0.0.1:5182` 调试页面
9. 按 @.agents/skills/code_review/SKILL.md 要求优化
10. 重复 8 - 9 ，确保没问题
11. 在项目 /demo/ 文件夹下，创建 `_.htm` `_.css` 文件，写法现代（比如 css nesting)，构建 jsfiddle 上给用户演示如何使用的代码。
    注意:
    - 不生成完整的 html，不写 html、body head 等标签，只包含演示组件各种状态代码的 html 片段
    - 不导入组件的 js 和 css (会在外面的生成器中会注入)
12. 运行 `./demo.sh 项目名 `，然后，打开浏览器 `http://127.0.0.1:1900` 调试，有问题就修改 11 步的代码
13. 在项目目录下创建 `i18n/zh/README.md` ，描述组件。
    第一行是组件的一句话概述（只写功能，不要句号，不写『苹果、Liquid Glass』，不写技术栈，不包含组件英文名称(可以用中文名))，文风要简洁，惜字如金，只写功能点，不写形容词。然后介绍功能，如何使用，演示代码
14. 如要在 page 下面的页面全局导入，请在 page/entry/init.js 中 import "lib/项目名.js" ，如果只是单个页面需要用，请在 page 目录下，相关的 svelte 文件中 import "lib/项目名.js" ，运行 ./com.js 会基于 com/ 文件夹打包生成 lib 文件夹的可引用组件
