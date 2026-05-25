自定义虚拟滚动条

## 功能

- **双向滚动**：提供垂直（`v-scroll`）和水平（`h-scroll`）滚动容器
- **尺寸响应**：监听内容与容器尺寸变化，自动更新滚动条尺寸与位置，无溢出时自动隐藏
- **交互支持**：支持滚轮滚动、滑块拖拽与轨道点击定位
- **状态显隐**：悬停或滚动时显示并加宽滑块，静止时自动隐藏

## 使用

在 HTML 中直接使用自定义标签：

```html
<!-- 垂直滚动 -->
<v-scroll>
  <div>滚动内容</div>
</v-scroll>

<!-- 水平滚动 -->
<h-scroll>
  <div>滚动内容</div>
</h-scroll>
```

在 JS 中引入组件：

```javascript
import "com/Scroll/scroll.js";
```

## 演示代码

```svelte
<script>
import "com/Scroll/scroll.js";
</script>

<template lang="pug">
v-scroll
  b(style="height:1000px;") 垂直滚动内容
</template>

<style lang="stylus">
v-scroll
  width 300px
  height 400px
  border 1px solid #0000000f
</style>
```
