# 轻量消息提示

用于在屏幕边缘显示简短的临时消息提示。

## 功能

- 支持普通消息和错误消息
- 支持设置自动消失时长与手动关闭
- 支持多重提示堆叠显示与动态高度自适应计算

## 使用方法

### 基础调用

```javascript
import toast, { toastErr } from "lib/Toast.js";

// 普通提示
toast((el) => {
  el.innerText = "操作成功";
});

// 错误提示
toastErr((el) => {
  el.innerText = "错误提示，请重试";
});
```

### 配置项说明

可以通过第二个参数传入配置数组进行定制：

```javascript
import toast, { TOAST_TIMEOUT, TOAST_HAS_CLOSE, TOAST_BODY } from "lib/Toast.js";

toast(
  (el) => {
    el.innerText = "自定义配置提示";
  },
  [
    [TOAST_TIMEOUT, 3],     // 消失时长（秒），0 表示不自动消失，默认 9 秒
    [TOAST_HAS_CLOSE, 0],   // 是否显示关闭按钮（1：显示，0：隐藏），默认 1
    [TOAST_BODY, parentEl]  // 挂载的父容器元素，默认挂载至最上层开启的 dialog 或 body
  ]
);
```
