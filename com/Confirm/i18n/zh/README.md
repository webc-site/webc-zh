函数式确认弹窗

## 功能

- **函数式调用**：提供 Confirm 纯函数展示确认对话框
- **确定与取消**：内置确定与取消按钮，点击自动关闭并从 DOM 中移除元素
- **异步处理**：确定回调支持 Promise，等待操作完成后再关闭
- **富文本渲染**：支持传入渲染函数自定义弹窗内容与结构

## API

### `Confirm(render, onOk)`

- **参数**：
  - `render` (`Function`): 渲染主体内容的回调函数 `(container) => {}`。支持返回 `Promise`，在 `Promise` resolve 前，容器自带 `.Wait` 状态。
  - `onOk` (`Function`): 点击“确定”按钮的回调。支持返回 `Promise`，将等待 `Promise` resolve 后自动关闭弹窗。
- **返回值**：`HTMLDialogElement` 弹窗原生 dialog DOM 节点。

## 使用

```javascript
import Confirm from 'lib/Confirm.js';

// 渲染函数示例
Confirm((el) => {
  const h3 = document.createElement('h3'),
    p = document.createElement('p');
  h3.textContent = '危险操作';
  p.textContent = '操作不可逆，请确认已备份数据。';
  el.append(h3, p);
}, async () => {
  await doDelete();
});
```
