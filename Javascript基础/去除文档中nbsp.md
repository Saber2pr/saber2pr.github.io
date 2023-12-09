在 HTML 文档中是没有空格的，`&nbsp;` 符号用来强制插入空格。

去除 nbsp：

```js
export const noNbsp = (str: string) =>
  str.replace(new RegExp("\u00A0", "g"), "")
```
