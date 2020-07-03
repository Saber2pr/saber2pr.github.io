先上代码：

```ts
export function initReactive(designSize = 1920) {
  if (typeof window === 'undefined') {
    return
  }
  const remSetter = document.createElement('style')
  remSetter.type = 'text/css'
  document.head.append(remSetter)
  function setFontSize() {
    const html = document.documentElement
    const clientWidth = html.clientWidth
    const fontSize = clientWidth / designSize
    remSetter.innerHTML = 'html{font-size:' + fontSize + 'px;}'
  }
  const EVENT_TYPE =
    'onorientationchange' in window ? 'orientationchange' : 'resize'
  window.addEventListener(EVENT_TYPE, setFontSize, false)
  window.addEventListener('pageshow', setFontSize, false)
  setFontSize()
}
```

rem 等于 html 根元素字体的大小，重要的是，当 html 字体大小变化时，所有以 rem 为单位的都会更新！

所以可以按设计尺寸 designSize 为单位换算！designSize 就是设计图的宽度。
