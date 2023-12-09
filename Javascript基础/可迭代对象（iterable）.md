### 可迭代对象(iterable)

可迭代对象(iterable)就是部署有 Symbol.iterator 的对象

使用 for-of 遍历时会自动获取迭代器的返回值

```js
const obj = {
  [Symbol.iterator]: function*() {
    for (let i = 9; i > 0; i--) yield i
  }
}

for (let i of obj) {
  console.log(i)
}
```

### 判断一个对象是否是可遍历对象

> 就是看有没有部署 Symbol.iterator 接口，该属性是 function 类型

```js
function isIterable(obj) {
  return typeof obj[Symbol.iterator] === "function"
}
```

### js 内置 iterable

String、Array、Map、Set、arguments 和其他伪数组、generator

> 注意 WeakMap 和 WeakSet 不是 iterable

```js
console.log(isIterable("")) // true
console.log(isIterable([])) // true
console.log(isIterable(new Map())) // true
console.log(isIterable(new WeakMap())) // false
console.log(isIterable(new Set())) // true
console.log(isIterable(new WeakSet())) // false
console.log(isIterable(arguments)) // true
console.log(isIterable(document.getElementsByTagName("script"))) // true
console.log(isIterable((function*() {})())) // true
```

> FileList 也是伪数组
