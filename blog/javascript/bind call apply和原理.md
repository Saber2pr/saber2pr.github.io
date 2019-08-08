# 作用域

```js
// 对象作用域
const objContext = {
  value: 1,
  getValue(v1, v2) {
    if (v1 && v2) return v1 + v2 + this.value
    return this.value
  }
}
// 获取对象作用域内的函数
const method = objContext.getValue

// 函数作用域下（父作用域不能访问子作用域！）
console.log(method()) // undefined

// 手动转移（绑定、指定）执行上下文到objContext上下文中
console.log(method.apply(objContext)) // 1
console.log(method.call(objContext)) // 1
console.log(method.bind(objContext)()) // 1
```

# 实现 call

```js
Function.prototype.myCall = function(thisArg, ...argArray) {
  // Symbol是es6增加的第六个基本类型，对于对象属性就是uuid
  const id = Symbol()
  // 获取要指定的上下文
  context = thisArg || window
  // 将当前函数链接到指定的上下文中
  context[id] = this
  // 当前函数在context上下文中执行
  const result = context[id](...argArray)
  // 移除context中已执行的当前函数
  delete context[id]
  // 返回结果
  return result
}
```

# 实现 bind

```js
Function.prototype.myBind = function(thisArg, ...argArray) {
  return () => this.myCall(thisArg, ...argArray)
}
```

# 实现 apply

```js
Function.prototype.myApply = function(thisArg, argArray = []) {
  return this.myCall(thisArg, ...argArray)
}
```

```js
console.log(Math.max.myCall(null, ...[1, 2, 3])) // 3

console.log(method.myApply(objContext, [1, 2])) // 4
console.log(method.myCall(objContext, 1, 2)) // 4
console.log(method.myBind(objContext, 1, 2)()) // 4

console.log(objContext)
```

# 总结一下

核心就是 call 的实现。其实 apply 和 bind 实现任意一个就好了。
method.call(thisArg, ...items)
一个函数内部如果不读取上下文的话，call 不 call 没区别。
原因就是 js 函数执行的上下文和声明时所处的上下文并不总是相同，也就是 this 是个动态变化的值
所以为了避免函数内调用 this 时发生错误，一般用 call 绑定到声明时所处的上下文
所以 call 需要做的：

1.  由于在 call 函数内，this 本身就是函数，所以直接把 this 赋给 context 的属性就完成了绑定
2.  在 context 内声明一个新的函数值指向 this，然后用对象作用域调用这个新的函数
    其实就是利用了`obj[method]`这种方法实现的绑定，给 obj 内新建一个函数指向当前，然后执行，obj 作为上下文去调用自己的属性
