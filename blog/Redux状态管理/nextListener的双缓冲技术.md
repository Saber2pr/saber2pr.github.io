源码位置：

```js
function subscribe(listener) {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice()
  }

  nextListeners.push(listener)

  return function unsubscribe() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }

    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
    currentListeners = null
  }
}

function dispatch(action) {
  const listeners = (currentListeners = nextListeners)
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }
  return action
}
```

next+current 属于读写分离的双缓冲技术。

如果 dispatch 的同时发生了 subscribe，遍历过程对 currentListener 的读取就会发生异常，必须控制写入优先级高于读取。

如果 nextListeners 负责写入，currentListener 只负责读，就能避免单 currentListeners 队列情况下还要去处理并发写入的互斥锁以及读写优先级等复杂问题。
