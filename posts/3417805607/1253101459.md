1. Strange function 1
```js
const connect = s => p =>
  connect(p(s))


const origin = 10


const task = req => req + 1


const output = res => {
  console.log(res)
  return res
}


connect(origin)(task)(task)(task)(task)(task)(output)
```
2. Y group zygote to achieve anonymous recursion
> looking for rules?
```js
const sum = num => (num > 0 ? num + sum(num - 1) : num)


const sumR = sum => num => (num > 0 ? num + sum(sum)(num - 1) : num)


console.log((f => f(f))(sum => num => num > 0 ? num + sum(sum)(num - 1) : num)(3)) // 6


console.log((f => f(f))(sum => num => num > 0 ? num + ((f => f(f))(sum))(num - 1) : num)(3)) // 6


console.log(sumR(sumR)(3))
```