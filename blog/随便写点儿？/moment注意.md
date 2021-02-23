moment 对象的很多方法是不纯的，例如 subtract 执行后原日期对象也会变化。需要使用 clone 方法。

示例：

```ts
const end = moment()
const start = end.subtract(3, 'days') // 执行后 start 和 end 的日期其实是相等的

// 正确用法
const start = end.clone().subtract(3, 'days')
```
