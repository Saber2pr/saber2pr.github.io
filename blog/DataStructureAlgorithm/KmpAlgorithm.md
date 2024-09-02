### Next function
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
### Kmp function
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
Next [j] is the maximum common prefix length in the pattern string "p1...pj". If not, it is + 1 (that is, next [j-1] + 1); when there is a mismatch in kmp matching, I does not change (the main string does not backtrack), j = next [j], and then continue to match back. If j = 0, both I and j are + 1. If j is greater than the pattern string length, the match is successful, and the I-pattern string length is returned as the result.
For example, the pattern string "abaabcac", next [] = [0Jing 1Jing 1JI 2jue 2jue 3jue 1jue 2]
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