If multiple promise writes to the same object, there will be competition over who should be written in the end.
By default, multiple writes are made on a first-come-first-served basis.
But sometimes you just want the fastest response and ignore the follow-up. Then you can use Promise.race, but it's not very convenient, because you need to know the promise array in advance, and if it's an asynchronous promises, it won't work (such as clicking a button to make a promise request).
Therefore, we can make use of the lock mechanism, one resource to be written corresponds to a lock, lock:true is set before the request is sent, and lock:false is set after the first write to prevent subsequent writes.
The race implementation is as follows:
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
An id corresponds to a resource to be written, and multiple promise share an id, for example:
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
The div [ref] node is written by two promise, and the corresponding id is the default "default".