如果多个 promise 对同一个对象做写入操作的话，就会产生竞争，到底最终该写入谁的结果。

默认情况会按照先来后到进行多次写入。

但是有时候只想要最快响应的结果，忽略掉后续。那么可以使用 Promise.race，但这并不是很方便，因为这需要提前知道 promise 数组，如果是非同步的 promises 就没法用了（比如点击按钮发一次 promise 请求）。

所以可以利用锁机制，一个待写入资源对应一把锁，在发请求前设置 lock:true，第一次写入后设置 lock:false 阻止后续写入。

race 实现如下：

```js
const race = (promise, then, id = "default") => {
  const locks = race.locks || {}
  locks[id] = true
  race.locks = locks
  promise.then(value => {
    if (locks[id]) {
      then(value)
      locks[id] = false
    }
  })
}
```

一个 id 对应一个待写入资源，多个 promise 共用一个 id，例如：

```tsx
const App = () => {
  const ref = useRef()
  return (
    <div>
      <nav>
        <button
          onClick={() => {
            race(fetch("//xxx"), v => {
              ref.current.innerText = v
            })
          }}
        >
          show1
        </button>
        <button
          onClick={() => {
            race(fetch("//yyy"), v => {
              ref.current.innerText = v
            })
          }}
        >
          show2
        </button>
      </nav>
      <div ref={ref} />
    </div>
  )
}
```

div[ref]节点被两个 promise 写入，对应 id 为默认"default"。
