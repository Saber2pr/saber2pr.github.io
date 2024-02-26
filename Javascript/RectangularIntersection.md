# Test intersecting elements
```js
/**
 * `请确保两个元素在同一个父元素下`
 * @param {HTMLElement} element1
 * @param {HTMLElement} element2
 * @param {Function} onEnter
 * @param {Function} onOut
 */
const testEnter = (element1, element2, onEnter, onOut) => {
  // clientWidth表示内容宽，包含内边距
  const width1 = element1.clientWidth
  const height1 = element1.clientHeight
  const width2 = element2.clientWidth
  const height2 = element2.clientHeight
  // offsetLeft表示相对父元素左边的距离
  const x1 = element1.offsetLeft
  const y1 = element1.offsetTop
  const x2 = element2.offsetLeft
  const y2 = element2.offsetTop

  // 坐标区间测试
  if (
    x1 > x2 - width1 &&
    x1 < x2 + width2 &&
    y1 > y2 - height1 &&
    y1 < y2 + height2
  ) {
    onEnter && onEnter()
  } else {
    onOut && onOut()
  }
}
```