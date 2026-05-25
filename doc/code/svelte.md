# svelte 规范

## js

首先，要遵循 ./js.md 代码规范

把事件写到元素标签上，比如 `<button onclick={...}>`; 如在属性中直接写函数，用 `onclick!=` 这种 `!=` 的写法，避免 pug 转义函数

尽量用 `onMount` 而不是 `$effect`

如果数组内部不需要响应式，用 `$state.raw`

避免过度用 `?.`，避免过度防御式编程，如果是必须的依赖，直接写 `.`

用 keyCode 而不是 字符串 来判断键盘事件（写注释，说明 keyCode 的含义）

如有多个代码需要比较，用数组+includes 来判断（不要用多个==）

用 `==` 而不是 `===` (除非明确要区分 `0 / null / undefined`)

不要在 js 中导入 styl，在 <style lang="stylus"> 中 @import

避免写雷同的字符串，请定义 const

文案不要用于状态切换，统一用 const 数字来区分状态

## pug

用 `b` 标签，而不是 `div / span`，让代码更简洁

如多个标签绑定事件代码一样，就抽取公共函数，减少代码重复

亦可用 `+snippet` 提高代码复用，pug 语法见 @doc/code/pug.md

## stylus

不用 rem，用 px

不写--webkit 等浏览器专属样式，用标准样式

不写 100vh，写 100dvh

如果 svelte 某个标签只有一个，用标签选择器，避免用 class 选择器

减少 class 的使用，多用原生的 css nesting + 标签的层级选择器，例外情况如下:

- 同一层级，有两个相同标签，需要不同的样式
- 为了复用 [../styl 目录](../styl/) 下面的全局样式而定义的 css 选择器
- 避免写雷同的 css，可以多个选择器+同样的 css 设置，减少代码
- 一个 var 只需要一个值，不要用嵌套的 var

## 目录结构

tag 下面的标签，会打包为网页组件，使用的时候，请先写 `import "-/ 名称.js"`，比如 `import "-/FileList.js"`
