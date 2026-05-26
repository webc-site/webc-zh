语言选择的按钮与弹窗

## 功能

- **语言切换**：点击按钮弹出语言选择浮层
- **多语言集成**：内置支持 @3-/lang 全部语言列表
- **状态高亮**：根据当前语言自动高亮显示选中状态

## API

### `I18n(langGet, langSet)`

- **参数**：
  - `langGet` (`Function`): 获取当前语言索引的函数 `() => index`。
  - `langSet` (`Function`): 设置选中语言索引的回调函数 `(index) => {}`。
- **返回值**：`HTMLButtonElement` 语言选择按钮 DOM 节点。

## 使用

```javascript
import I18n from 'lib/I18n.js';

let cur_lang = 1;

const btn = I18n(
  () => cur_lang,
  (idx) => {
    cur_lang = idx;
    console.log('Language changed to: ' + idx);
  }
);

document.body.appendChild(btn);
```
