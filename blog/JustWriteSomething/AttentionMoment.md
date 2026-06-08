A lot of methods of moment object are impure, for example, subtract execution after the original date object will change. You need to use the clone method.
Example:
```ts
const end = moment()
const start = end.subtract(3, 'days') // 执行后 start 和 end 的日期其实是相等的

// 正确用法
const start = end.clone().subtract(3, 'days')
```