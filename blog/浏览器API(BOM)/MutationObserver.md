监视DOM元素变动。

> DOM3 Events规范的一部分

### 实现 Microtask

```ts
export interface Microtask extends MutationCallback {}

export function microtask(task: Microtask) {
  // 构造函数参数是一个function类型
  const observer = new MutationObserver(task)

  // 创建一个测试dom节点
  const element = document.createTextNode('')

  // 监听dom节点，
  observer.observe(element, {
    characterData: true
  })

  // 修改dom节点，触发MutationCallback
  element.data = ''
}
```

