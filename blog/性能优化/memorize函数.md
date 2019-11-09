要求：接受一个函数参数，返回它的 memo 后的版本。

原理：准备一个 map，用来记录函数的参数和对应结果。函数执行前，在 map 中查找输入记录，如果有，则直接返回对应结果，跳过函数执行；否则执行函数，并将参数和对应返回值存入 map。

> map 空间需设置最大值

```ts
const store = new WeakMap() // 记录函数对应输入记录的map
const MAX_SIZE = 10 // memo最大数量

const memo = (fn, thisArg) => (...args) => {
  // 从map中查找fn对应的记录，meta类型Array<[any[], any]>
  const meta = store.get(fn) || []

  // 存在输入记录
  if (meta.length) {
    // 查找输入对应结果
    const mo = meta.find(([p]) => diff(p, args))
    // 返回对应结果
    if (mo) return mo[1]
  }

  // 没有记录，执行函数
  const O = fn.apply(thisArg, args)

  // 保存参数和对应结果
  meta.push([args, O])
  store.set(fn, meta)

  // 清理溢出记录
  while (meta.length >= MAX_SIZE) meta.shift()

  // 返回函数执行结果
  return O
}
```

diff 函数用于浅比较两个数组是否相同(基本类型值的数组)

> 例如 diff([1, '2'], [1, '2'])结果为 true

```ts
const diff = (a, b) => {
  let i = a.length > b.length ? a.length : b.length

  while (i--) if (a[i] !== b[i]) return false

  return true
}
```
