### document.documentElement

返回 html 元素，即 DOM 根元素。

### document.body

返回 body 元素。

```ts
document.body.parentElement === document.documentElement // true
```

### document

提供了全局操作功能，能解决如何获取页面的 URL ，如何在文档中创建一个新的元素等问题。

> document 作为通用接口可以操作 html、xml、svg 等。

> document 细分为 HTMLDocument(html)、XMLDocument(xml 和 svg)。
