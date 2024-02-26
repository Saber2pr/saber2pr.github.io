## Object.defineProperty
```js
/**
 * bind
 * @param {object} target
 * @param {object} model
 * @param {object} map
 */
const bind = (target, model, map) =>
  Object.keys(map || target).forEach(key =>
    Object.defineProperty(target, key, {
      set(value) {
        const mkey = map ? map[key] : key
        model[mkey] = value
      },
      get() {
        const mkey = map ? map[key] : key
        return model[mkey]
      }
    })
  )

window.__alternate = {}
const p = document.getElementById("p")

bind(__alternate, p, {
  value: "innerHTML"
})
```
## Proxy
```js
/**
 * bind
 * @param {object} model
 * @param {object} map
 */
const bind = (model, map) =>
  new Proxy(map || model, {
    get(_, key) {
      const mkey = map ? map[key] : key
      return Reflect.get(model, mkey)
    },
    set(_, key, value) {
      const mkey = map ? map[key] : key
      return Reflect.set(model, mkey, value)
    }
  })

window.__alternate = bind(document.getElementById("p"), {
  value: "innerHTML"
})
```