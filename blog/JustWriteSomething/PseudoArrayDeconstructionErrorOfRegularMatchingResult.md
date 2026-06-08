Pseudo arrays can only be traversed, not using Array methods, including deconstruction.
```ts
// 严格模式报错
let [a, b] = /\((.*),(.*)\)/.exec('(1,2)')
// 转为真数组
let [a, b] = Array.from(/\((.*),(.*)\)/.exec('(1,2)'))
```