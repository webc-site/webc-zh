语言选择的按钮与弹窗

## 功能

- **语言切换**：点击按钮弹出语言选择浮层
- **状态高亮**：根据当前语言自动高亮显示选中状态

## API

### `<c-i18n>`

- **说明**：自动注册名为 `c-i18n` 的自定义 HTML 组件。只需导入 JS 并在 HTML 中使用 `<c-i18n></c-i18n>` 即可。

## 使用

```html
<c-i18n></c-i18n>
```

```javascript
import 'lib/I18n.js';
import NAME from '@3-/lang/NAME.js';
import { onLang, LANG_LI } from 'x/i18n.js';

LANG_LI.splice(0, LANG_LI.length, ...NAME.map((name, id) => [name, id]));

onLang((idx) => {
  console.log('Language changed to: ' + idx);
});
```

## x/i18n.js 状态管理

用于管理全局语言状态：

- **`LANG_LI`**: 支持的语言列表数组，可用 `splice` 写入 `[[NAME, ID], [NAME, ID], ...]` 格式的数据，也可配合 [`@3-/lang`](https://www.npmjs.com/package/@3-/lang) 写入：`LANG_LI.splice(0, LANG_LI.length, ...NAME.map((name, id) => [name, id]))`。
- **`langGet()`**: 获取当前设定的语言索引
- **`langSet(idx)`**: 设置当前语言索引并通知所有订阅者
- **`onLang(func)`**: 订阅语言变更，若已设定语言则立即触发回调。返回取消订阅的卸载函数。
