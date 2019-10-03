export const throttle = (
  callback: Function,
  delta = 500,
  metaKey = "__$$count"
) => {
  const next = () => Reflect.set(throttle, metaKey, Date.now() + delta)
  Reflect.has(throttle, metaKey) || next()
  if (Date.now() > Reflect.get(throttle, metaKey)) {
    next()
    callback()
  }
}
