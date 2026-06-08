After the Modal pops up, if its content needs to be scrolled, it will conflict with the scrolling of the document, also known as the scrolling penetration problem. So after the Modal pops up, you need to hide the scroll at the top level of the document and restore it when Modal is closed. That is:
```js
// 隐藏顶层scroll
document.documentElement.style.overflow = 'hidden'
// 恢复顶层scroll
document.documentElement.style.overflow = 'auto'
```
> or body.style.overflow = 'hidden'
Antd Modal does the above by default.