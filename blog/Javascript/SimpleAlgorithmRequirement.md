### Judge back to the text string
```js
function checkStr(str) {
  return (
    str ===
    str
      .split("")
      .reverse()
      .join("")
  )
}
console.log(checkStr("abcdef"))
```
### Array deduplication
1. Using Set data structure
```js
function dedup(arr) {
  return [...new Set(arr)]
}
```
two。 Using Array.prototype.includes
```js
function dedup(arr) {
  return arr.reduce(
    (out, cur) => (out.includes(cur) ? out : out.concat(cur)),
    []
  )
}
```
3. Take advantage of Object attribute
```js
function dedup(arr) {
  const obj = {}
  const result = []
  for (const item of arr) {
    if (!(item in obj)) {
      obj[item] = result.push(item)
    }
  }
  return result
}
```
4. Deduplication of object array
```js
const array = [
    { url: 'xxx' },
    { url: 'xxx' },
    { url: 'yyy' }
]

const dedup = (arr, key) => array.reduce((acc, item) =>
    acc.find(i => i[key] === item[key]) ? acc : acc.concat(item), [])
    
dedup(array, 'url')
```
### Array disorder
1. Using sort and random
```js
const shuffle = arr => arr.sort(() => Math.random() - 0.5)
```
two。 Random exchange
```js
function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    const index = parseInt(Math.random() * (arr.length - 1))
    ;[arr[i], arr[index]] = [arr[index], arr[i]]
  }
  return arr
}
```
### Fibonacci
```js
function Fibonacci(n) {
  const result = []
  let i = 0
  while (i < n) {
    if (i <= 1) {
      result.push(i)
    } else {
      result.push(result[i - 1] + result[i - 2])
    }
    i++
  }
  return result
}
```
### Find out the maximum difference of the array
```js
function getMaxProfit(arr) {
  return Math.max.apply(null, arr) - Math.min.apply(null, arr)
}
```
### Randomly generate a string of specified length
```js
function randomString(length) {
  const str = "abcdefghijklmnopqrstuvwxyz9876543210"
  return Array(length)
    .fill("")
    .map(() => str.charAt(Math.floor(str.length * Math.random())))
    .join("")
}
```
### Implement getElementsByClassName
```js
function queryClassName(element, className) {
  return Array.from(element.getElementsByTagName("*")).filter(
    e => e.className === className
  )
}
```
### Empty the array
1. Using Array.prototype.splice
```js
function clear(arr) {
  arr.splice(0, arr.length)
  return arr
}
```
two。 Directly assign a value to Array.prototype.length
```js
function clear(arr) {
  arr.length = 0
  return arr
}
```
### Keep specified decimal places
Number.prototype.toFixed
```js
function Fix(n, fractionDigits) {
  return n.toFixed(fractionDigits)
}
```
### Generates a random alphanumeric string of specified length (uuid)
Math.random().toString(36) outputs a result with a decimal point in front of it, so use substr to intercept the latter part.
> the first parameter of both substr and slice is the start position, the second parameter substr is the length, and slice is the end position
```js
function uuid(len = 10) {
  let str = ""
  while (str.length < len) {
    str += Math.random()
      .toString(36)
      .substr(2)
  }
  // 控制长度
  return str.slice(0, len)
}
```
### Implement a simple template engine
```js
function render(template, data) {
  // const slot = /{{\w+}}/g
  // const bracket = /{{|}}/g
  // let res = slot.exec(template)
  // while (res) {
  //   template = template.replace(res[0], data[res[0].replace(bracket, '')])
  //   res = slot.exec(template)
  // }
  // return template
  return template.replace(/{{\w+}}/g, slot => data[slot.replace(/{{|}}/g, "")])
}
console.log(render(`name:{{name}}, age:{{age}}`, { name: "saber", age: 21 }))
```
### Randomly select an element in an array
```js
const randSelect = list => list[parseInt(list.length * Math.random())]
```
### Limit the length after encode while ensuring that the result can be decode
```ts
/**
 * 限制encode后的长度，同时保证结果可以decode
 * ```ts
 * // 示例
 * decodeURIComponent(resolveEncode('一二三四五六七八', 45)) // 一二三四
 * ```
 */
 export const resolveEncode = (str: string, maxLen: number) => {
  let prev = '';
  let prevEncoded = '';
  for (const ch of str) {
    const current = prev + ch;
    const currentEncoded = encodeURIComponent(current);
    if (currentEncoded.length >= maxLen) {
      // fallback prev
      return prevEncoded;
    }
    prev = current;
    prevEncoded = currentEncoded;
  }
  return prevEncoded;
};
```