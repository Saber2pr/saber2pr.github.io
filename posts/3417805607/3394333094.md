```ts
export function getElementTop(elem: HTMLElement) {
  let elemTop = elem.offsetTop
  elem = elem.offsetParent as HTMLElement
  while (elem != null) {
    elemTop += elem.offsetTop
    elem = elem.offsetParent as HTMLElement
  }
  return elemTop
}
```
Get the distance of the element from the top of the browser viewport:
```ts
export function getElementFixedTop(elem: HTMLElement) {
  return elem.getBoundingClientRect().top
}
```