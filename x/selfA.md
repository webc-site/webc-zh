# 校验并处理同站 A 标签点击

## `selfA` : 判断 A 标签 href 是否为当前站点，若是则阻止默认点击并返回相对 URL 路径

### 参数

- p : HTMLAnchorElement 元素
- e : MouseEvent 点击事件对象

### 返回值

同站链接的相对 URL 路径，非同站则返回 undefined
