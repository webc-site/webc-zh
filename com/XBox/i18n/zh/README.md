带关闭按钮与退出事件的弹窗容器

## 功能

- **函数式调用**：通过调用 `xBox()` 即可创建并展示弹出层
- **右上角关闭**：自动渲染关闭按钮，点击可关闭弹窗
- **Esc 键退出**：支持通过键盘 Esc 键快速关闭弹窗并自动 blur 输入框
- **自动清理**：弹窗关闭后，自动从页面 DOM 中移除对应元素

## API

### `xBox(func)`

- **参数**：
  - `func`: `(dialog) => void` 可选的回调函数。在弹窗创建后执行，可用于向 dialog 渲染或加载内容。
- **返回值**：`HTMLDialogElement` 弹窗原生 dialog DOM 节点。可通过调用 `.close()` 关闭并自动移除节点。

## 使用

```javascript
import xBox from 'lib/XBox.js';

// 弹出带有右上角关闭按钮和 Esc 关闭支持的对话框
const dialog = xBox((box) => {
  const form = document.createElement('form');
  form.innerHTML = '<h3>自定义内容</h3>';
  box.append(form);
});
```
