```js
const addDragListener = (target, callback, onDragStart, onDragEnd) => {
    let lock = false
    target.onmousedown = event => {
        lock = true
        onDragStart && onDragStart(event)
    }
    document.onmousemove = event => {
        if (lock) {
            callback(event)
        }
    }
    target.onmouseup = event => {
        lock = false
        onDragEnd && onDragEnd(event)
    }
}
```