# Scope
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
# Implement call
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
# Implement bind
```js
Function.prototype.myBind = function(thisArg, ...argArray) {
  return () => this.myCall(thisArg, ...argArray)
}
```
# Implement apply
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
# To sum up.
The core is the implementation of call. In fact, it would be nice to implement either apply or bind.
Method.call (thisArg,... items)
If you don't read the context inside a function, call doesn't make a difference.
The reason is that the context in which the js function executes is not always the same as the context in which the declaration is made, that is, this is a dynamic value.
So in order to avoid errors when calling this within a function, you usually bind call to the context in which you declare it.
So what call needs to do:
1. Since this itself is a function within the call function, binding is done by assigning this directly to the property of context
two。 Declare a new function value pointing to this in context, and then call the new function with object scope
In fact, the binding implemented by the `obj [method] `method is used to create a new function in the obj that points to the current and then executes, and obj is used as the context to call its own properties.