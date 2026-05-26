# 按钮样式

提供高光与毛玻璃阴影的按钮与图标类

## 功能

- 普通按钮 `.Btn.Lg`
- 图标按钮 `.BtnC.Lg`
- 主要高亮状态 `.Btn.Lg.Main`

## 使用

为元素添加类名：

```html
<!-- 普通按钮 -->
<button class="Btn Lg">确认</button>

<!-- 主要高亮 -->
<button class="Btn Lg Main">提交</button>

<!-- 链接按钮 -->
<a class="Btn Lg" href="https://github.com">链接按钮</a>

<!-- 图标按钮 -->
<button class="BtnC Lg"><i class="Ico"></i></button>
```

## CSS 变量

可通过 CSS 变量自定义 `BtnC` 图标：

```html
<style>
  .BtnC.add {
    --btnIco: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1" stroke-linejoin="round"><path d="M10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 0 1-1z"/></svg>');
  }
</style>
<button class="BtnC add"><i class="Ico"></i></button>
```
