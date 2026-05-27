Svelte 中 Pug 书写规范

template 标签下面 pug 第一行必须顶格写，不缩进

pug 插件对 svelte 语法做了支持：+if, +else, +elseif, +each, +key, +await, +then, +catch, +html, +const, +debug, +snippet, +render。

【必看！缩进避坑警告】

`+else`、`+elseif` 要比 `+if` 多一层缩进(2 空格)

正确示例如下（阶梯式缩进）：

```
+if 条件1
  b 满足条件1的内容
  +elseif 条件2
    b 满足条件2的内容
  +else
    b 否则的内容
```

不要写 `+if("xxx")`，而是写 `+if xxx`（不需要括号和引号）

传值与防转义
向组件或元素传递带有特殊的逻辑判断（如 && ）或闭包时，必须使用 != 来代替 =，以此阻止 HTML 实体转换。

正确：使用 `!=`

```
button(disabled!={foo && bar})
button(onclick!={(e) => doTheThing(e)})
```

错误：直接用 = 会转义成 &amp;&amp;

注意：无法在属性里用 JS 原生模板字符串拼装，必须按照常规 Svelte 插值写法：attr="Hello {val}"

展开传值 (Spreading Props)
将 Svelte 的 {...obj} 展开语法嵌套在双引号内：
button(type="button" disabled "{...slide.props}") 发送

绑定与事件指令
和写正常的属性保持一致即可：
input(bind:value="{foo}")
input(on:input="{bar}")
