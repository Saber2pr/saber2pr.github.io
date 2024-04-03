The specified callback function is called before the next redrawing.
> llback function executes 60 times per second
Used for animation updates.
Don't use setInterval in animation! It is not triggered at strict intervals. It puts callbacks into the macro task execution stack at regular intervals. If the current execution stack is blocked, the callback interval is affected.
### Realization principle
It is realized by setTimeout.
NextTime > = lastTime + 16, which eliminates the extra time difference in setTimeout so that the interval between two callback calls is always 16ms.
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