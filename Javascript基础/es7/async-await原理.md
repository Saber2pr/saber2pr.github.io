### es5 生成器 generator

> yield 会保存执行位置，外部调用 next 回到 yield 处往下执行

```js
function* generator() {
  const next1 = yield 1
  console.log(next1)

  const next2 = yield 2
  console.log(next2)

  const next3 = yield 3
  console.log(next3)
}
const iterator = generator()
console.log(iterator.next()) // 第一次调用返回第一次yield的值，后续每调用一次向后迭代一次
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next()) // done true 意思是后面没有yield了，迭代结束
// next函数可接受一个值，会覆盖生成器中yield左边的值
```

### async 实现

```js
function async(generator) {
  // 调用生成器生成迭代器
  const iterator = generator()

  return function next(onfulfilled) {
    // 迭代一次
    const result = iterator.next(onfulfilled)
    // 如果yield完成，则返回
    if (result.done) return
    // 注册下一次迭代到promise回调中
    // 如果yield的值不是promise，则包装为Promise.resolve
    result.value.then
      ? result.value.then(onfulfilled => next(onfulfilled))
      : Promise.resolve(result.value).then(onfulfilled => next(onfulfilled))
  }
}

const delay = (time, value) =>
  new Promise(res => setTimeout(() => res(value), time))

async(function*() {
  const first = yield 1
  console.log(first)

  const second = yield delay(1000, 2) // 阻塞2秒
  console.log(second)

  const third = yield 3
  console.log(third)
})()
```
