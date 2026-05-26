语言选择的按钮与弹窗

## 功能

- **语言切换**：点击按钮弹出语言选择浮层
- **状态高亮**：根据当前语言自动高亮显示选中状态

## API

### `I18n()`

- **返回值**：`HTMLButtonElement` 语言选择按钮 DOM 节点。

## 使用

```javascript
import I18n from 'lib/I18n.js';
import NAME from '@3-/lang/NAME.js';
import { onLang, LANG_LI } from 'x/i18n.js';

LANG_LI.splice(0, LANG_LI.length, ...NAME.map((name, id) => [name, id]));

const btn = I18n();

onLang((idx) => {
  console.log('Language changed to: ' + idx);
});

document.body.appendChild(btn);
```

## x/i18n.js 状态管理

用于管理全局语言状态：

- **`LANG_LI`**: 支持的语言列表数组，可用 `splice` 写入 `[[NAME, ID], [NAME, ID], ...]` 格式的数据。
- **`langGet()`**: 获取当前设定的语言索引
- **`langSet(idx)`**: 设置当前语言索引并通知所有订阅者
- **`onLang(func)`**: 订阅语言变更，若已设定语言则立即触发回调。返回取消订阅的卸载函数。
