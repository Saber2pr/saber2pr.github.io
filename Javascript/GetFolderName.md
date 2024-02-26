From webpack plugin enhanced-resolve:
[CachedInputFileSystem](https://github.com/webpack/enhanced-resolve/blob/main/lib/CachedInputFileSystem.js#L13)
```ts
const dirname = path => {
  let idx = path.length - 1
  while (idx >= 0) {
    const c = path.charCodeAt(idx)
    // slash or backslash
    if (c === 47 || c === 92) break
    idx--
  }
  if (idx < 0) return ''
  return path.slice(0, idx)
}
```