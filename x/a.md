# 页面跳转拦截

全局监听 DOM 元素的点击事件，向上追溯至 A 标签或 BODY 元素。若追溯到 BODY 则终止。若追溯到含有效 href 的 A 标签，则拦截并调用 `selfA(p, e)` 处理：当 `selfA` 返回非 undefined 的 href 时，通过 `goto` 进行单页无刷新跳转并阻止默认行为；若返回 undefined 且 A 标签未指定 `target` 属性，则自动将其 `target` 设为 `_blank` 以在新窗口中打开。
