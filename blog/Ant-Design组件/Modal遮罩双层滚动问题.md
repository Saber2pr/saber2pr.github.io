Modal在弹出后，如果其内容需要滚动，会与文档的滚动发生冲突，也称为滚动穿透问题。所以在Modal弹出后，需要将文档顶层的scroll隐藏，Modal关闭时恢复。即：

```js
// 隐藏顶层scroll
document.documentElement.style.overflow = 'hidden'
// 恢复顶层scroll
document.documentElement.style.overflow = 'auto'
```
> 或者body.style.overflow = 'hidden'

Antd Modal默认会做以上事情。