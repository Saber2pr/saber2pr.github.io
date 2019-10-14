### next 函数

```js
const getNext = str => {
  const len = str.length
  let next = [-1]

  for (let i = 1, j = -1; i < len; i++) {
    while (str[i] !== str[j + 1] && j > -1) {
      j = next[j]
    }

    if (str[j + 1] === str[i]) {
      j = j + 1
    }

    next[i] = j
  }

  return next
}
```

### kmp 函数

```js
const search = (source, match) => {
  const next = getNext(match)
  const result = []

  const m = source.length
  const n = match.length

  let i = 0
  let j = 0
  while (i < m - n) {
    if (source[i] === match[j]) {
      i++
      j++

      if (j === n) {
        result.push(i - n)
        j = next[j - 1] + 1
      }
    } else {
      if (j === 0) {
        i++
      } else {
        j = next[j - 1] + 1
      }
    }
  }

  return result
}
```
