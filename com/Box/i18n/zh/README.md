函数式弹出层容器

## 功能

- **函数式调用**：通过调用 `Box()` 创建并展示弹出层
- **自动清理**：关闭弹出层时，自动从页面 DOM 中移除元素

## API

### `Box()`

- **参数**：无
- **返回值**：`HTMLDialogElement` 弹窗原生 dialog DOM 节点。可通过调用 `.close()` 关闭弹窗并自动移除节点。

## 使用

```javascript
import Box from 'lib/Box.js';

// 弹出基本对话框
const dialog = Box();

// 往 dialog 中添加内容
const form = document.createElement('form');
dialog.append(form);
```
