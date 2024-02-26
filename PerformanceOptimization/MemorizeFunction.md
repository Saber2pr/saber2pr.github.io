Requirement: take a function argument and return its memo version.
Principle: prepare a map to record the parameters of the function and the corresponding results. Before the function execution, look for the input record in map, if there is any, directly return the corresponding result and skip the function execution; otherwise, execute the function and store the parameter and the corresponding return value in map.
> the maximum value of map space needs to be set.
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
The diff function is used to compare whether two arrays are the same (arrays of base type values).
> for example, diff ([1,'2'], [1,'2']) results in true
```ts
const diff = (a, b) => {
  let i = a.length > b.length ? a.length : b.length

  while (i--) if (a[i] !== b[i]) return false

  return true
}
```