### next 函数

```js
function get_next(str) {
  const next = Array(str.length).fill(0)
  let i = 1
  let m = 0

  while (i < str.length) {
    if (str[i] === str[m]) {
      next[i] = ++m
      i++
    }
    if (str[i] !== str[m]) {
      if (m === 0) {
        next[i] = 0
        i++
      } else {
        m = next[m - 1]
      }
    }
  }
  return next
}
```

### kmp 函数

```js
function kmp(str, subStr) {
  let i = 0
  let j = 0

  const next = get_next(subStr)

  while (i <= str.length) {
    if (subStr[j] === str[i]) {
      i++
      j++
      if (j === subStr.length) {
        return i - j
      }
    } else {
      if (j === 0) {
        i++
      } else {
        j = next[j - 1]
      }
    }
  }
  return -1
}
```

next[j]就是模式串"p1...pj"中最大公共前后缀长度，如果没有就+1（即 next[j-1]+1）；kmp 匹配中失配时，i 不变（主串不回溯），j = next[j]，然后继续往后匹配。如果 j == 0，i 和 j 都+1。如果 j 大于模式串长度即匹配成功，返回 i - 模式串长度作为结果。

比如模式串"abaabcac"，next[] = [0,1,1,2,2,3,1,2]

```txt
a 0 （next[1] == 0）

ab 1 （没有公共前后缀，+1。next[2] = next[1]+1，即 next[2]==1）

aba 1 （最长公共前后缀"a"，长度 1）

abaa 2 （没有公共前后缀，+1）

abaab 2（最长公共前后缀"ab"，长度 2）

abaabc 3 （没有公共前后缀，+1）

abaabca 1（最长公共前后缀"a"，长度 1）

abaabcac 2 （没有公共前后缀，+1）
```
