# 轻量消息提示

用于在屏幕边缘显示简短的临时消息提示。

## 功能

- 支持普通消息和错误消息
- 自动消失与手动关闭
- 堆叠显示与动态高度计算

## 使用方法

```javascript
import toast, { toastErr } from "lib/Toast.js";

// 普通提示
toast("操作成功！");

// 错误提示
toastErr("操作失败！");
```
