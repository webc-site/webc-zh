# 输入框样式

具有标签悬浮过渡动画的输入框类

## 功能

- 标签悬浮动画：未输入时标签呈 placeholder 样式，有输入时平滑缩放并悬浮至上方
- 支持原生 CSS 动画与毛玻璃视觉风格

## 使用

通过父级容器包裹 `input` 和 `label` 元素，并添加 `.Input.Lg` 类，建议使用更轻量的 `b` 标签：

```html
<b class="Input Lg">
  <input type="text" placeholder=" " id="email">
  <label for="email">电子邮箱</label>
</b>
```

> [!NOTE]
> 为使过渡动画在无输入内容时正确复位，`input` 必须显式设置 `placeholder=" "` (含空格占位符)。
