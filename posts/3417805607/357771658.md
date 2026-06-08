### Partial function
> king advantage of Function.prototype.bind
Causes a function to have default initial parameters.
```ts
const add = (a: number, b: number, c: number) => a + b + c

const add2 = add.bind(add, 1)
// 得到 add2 = (b: number, c: number) => 1 + b + c

console.log(add2(2, 3))
```
### Ke Shu
The above steps are repeated to obtain Collier.
```ts
const curry = fn => arg => (fn.length === 1 ? fn(arg) : curry(fn.bind(fn, arg)))

console.log(curry(add)(1)(2)(3))
```