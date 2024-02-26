```js
const clone = value => {
  if (typeof value !== "object") return value
  // 遍历每个属性，执行clone，并把返回值添加到新对象对应属性上
  return Object.keys(value).reduce(
    (out, key) =>
      Object.assign(out, {
        [key]: clone(value[key])
      }),
    {}
  )
}

const obj = {
  name: "saber",
  age: 21,
  like: ["js", "ts"]
}

const newObj = clone(obj)
console.log(obj, newObj)
obj.age = 233
obj.like.push("vv")
console.log(obj, newObj)
```
# supplementary
Deep copy encounters circular references, infinite recursion leads to stack overflow
Lodash, on the other hand, can make a copy of a circular reference, which works:
Using stack, after each access to an attribute, the value is stored in stack, and if it already exists in stack, it indicates that a circular reference has occurred and will be returned directly.
That is, if you encounter the property of a circular reference, make a shallow copy.