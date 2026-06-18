### Virtual dom constructor
```js
function VDom(props, children) {
  this.props = props
  this.children = children
}
```
### Fiber constructor
```js
function Fiber(instance, parent, child, sibling) {
  this.instance = instance
  this.parent = parent
  this.child = child
  this.sibling = sibling
}
```
### Link
> the children of the linked fiber instance vdom is an one-way linked list and returns the first child node. If the fiber instance vdom does not have a children, it returns null.
```js
function link(fiber) {
  if (!fiber.instance.children) return null
  return (fiber.child = fiber.instance.children.reduceRight(
    (sibling, current) => new Fiber(current, fiber, null, sibling),
    null
  ))
}
```
### Fiber iterative algorithm
> pth first traversal
```js
function next(fiber) {
  const child = link(fiber)
  if (child) return child
  let current = fiber
  while (current) {
    if (current.sibling) return current.sibling
    current = current.parent
  }
}
/**
 * 循环迭代
 * @param {Fiber} fiber
 * @param {(fiber:Fiber) => void} callback
 */
function loop(fiber, callback) {
  let current = fiber
  while (current) {
    callback(current)
    current = next(current)
  }
}
```
```js
// 虚拟dom树
const root = new VDom({ value: 1 }, [
  new VDom({ value: 2 }, [new VDom({ value: 4 })]),
  new VDom({ value: 3 }, [new VDom({ value: 5 })])
])

// 虚拟dom树转为fiber链表，开始遍历
loop(new Fiber(root), fiber => console.log(fiber.instance.props))

let __current = new Fiber(root)
// 使用浏览器调度API-requestIdleCallback
function work(dline) {
  console.log(__current.instance.props, dline.timeRemaining())
  __current = next(__current)
  if (__current) requestIdleCallback(work)
}

requestIdleCallback(work)
```