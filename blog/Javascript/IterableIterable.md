### Iterable object (iterable)
An iterable object (iterable) is an object with Symbol.iterator deployed.
The return value of the iterator is automatically obtained when traversing with for-of
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
### Determine whether an object is traverable or not
> is to see if the Symbol.iterator interface is deployed. This property is of type function.
```js
function isIterable(obj) {
  return typeof obj[Symbol.iterator] === "function"
}
```
### Js built-in iterable
String, Array, Map, Set, arguments and other pseudo arrays, generator
> Note that WeakMap and WeakSet are not iterable
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
> FileList is also a pseudo array