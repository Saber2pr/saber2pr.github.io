```js
/**
 * 进入视口范围检测
 *
 * @param {HTMLElement} element
 * @param {VoidFunction} onEnter
 * @param {VoidFunction} onOut
 * @param {number} [deltaTop=0]
 * @param {number} [deltaBottom=0]
 */
function testClientRect(
  element,
  onEnter,
  onOut,
  deltaTop = 0,
  deltaBottom = 0
) {
  const rect = element.getBoundingClientRect()
  // 坐标区间检测
  if (
    rect.y < window.innerHeight + deltaTop &&
    rect.y > -rect.height + deltaBottom
  ) {
    onEnter && onEnter()
  } else {
    onOut && onOut()
  }
}
```