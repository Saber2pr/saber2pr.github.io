# Throttling
```js
const throttle = (callback, delta = 500, id = "default") => {
  const next = () => {
    throttle[id] = Date.now() + delta
  }
  throttle[id] || next()
  if (Date.now() > throttle[id]) {
    next()
    callback()
  }
}
```
# Anti-shaking
```ts
const debounce = (callback, delta = 300, id = "default") => {
  clearTimeout(debounce[id])
  debounce[id] = setTimeout(callback, delta)
}
```