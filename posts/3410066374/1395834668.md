Source code location:
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
Next+current belongs to the double buffering technology of read-write separation.
If subscribe occurs at the same time of dispatch, an exception will occur in the reading of currentListener during traversal, and the priority of writing must be controlled over reading.
If nextListeners is responsible for writing and currentListener is only responsible for reading, you can avoid complex issues such as mutexes and read-write priorities for concurrent writes in the case of a single currentListeners queue.