```js
const charToNum = char => char.charCodeAt(0) - 97
const numToChar = num => String.fromCharCode(97 + num)

const decrypt = (value, shift) =>
  Array.from(value)
    .map(ch => numToChar(charToNum(ch) - (shift % 26)))
    .join('')

const encrypt = (value, shift) =>
  Array.from(value)
    .map(ch => numToChar(charToNum(ch) + (shift % 26)))
    .join('')
```