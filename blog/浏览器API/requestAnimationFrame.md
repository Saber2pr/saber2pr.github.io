下次重绘之前调用指定的回调函数。

> 回调函数每秒执行60次

用于动画更新。

动画不要使用setInterval！它不是严格的时间间隔触发。它是每隔一段时间将回调放入宏任务执行栈中。如果当前执行栈被阻塞，则会影响回调间隔。

### 实现原理

利用setTimeout实现。

nextTime >= lastTime + 16，在setTimeout里将多余出来的时间差消除，让两次callback调用之间间隔总是16ms。

```js
let lastTime = 0; 

const requestAnimationFrame = callback => {
  const now = Date.now()
  const nextTime = Math.max(lastTime + 16, now)

  return setTimeout(() => 
    callback(lastTime = nextTime), 
    nextTime - now)
}

const cancelAnimationFrame = clearTimeout
```
