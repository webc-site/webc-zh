加载动画与表单提交遮罩

## 功能

- **独立加载**：元素添加 `.wait` 类显示加载图标
- **表单遮罩**：表单添加 `.ing` 类显示遮罩与加载图标，防止重复提交

## 使用

```svelte
<template lang="pug">
// 独立加载动画
b.wait

// 表单提交遮罩
form.ing
  input(type="text")
  button(type="submit") 提交
</template>

<style lang="stylus">
@import "com/Wait/Wait.styl"
</style>
```
