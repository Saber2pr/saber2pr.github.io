### 虚拟 dom 构造函数

```js
function VDom(type, props, children) {
  this.type = type
  this.props = props
  this.children = children
}

function h(type, props, children = []) {
  return new VDom(type, props, children)
}

const tree = h("div", {}, [h("p", { innerText: "hello" })])
```

### 渲染函数

```js
function renderDom(vdom, container) {
  const dom = document.createElement(vdom.type)
  Object.entries(vdom.props).forEach(([k, v]) => (dom[k] = v))
  container.append(dom)
  vdom.children && vdom.children.forEach(child => renderDom(child, dom))
}

renderDom(tree, document.getElementById("root"))
```

### 迭代器遍历

```js
function* toIterable(vdom, stack = [vdom]) {
  while (stack.length) {
    const node = stack.pop()
    node.children && stack.push(...node.children)
    yield node
  }
}
console.log(Array.from(toIterable(tree)))
```
