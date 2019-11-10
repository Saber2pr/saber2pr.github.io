export const debounce = (callback: Function, delta = 300) => {
  clearTimeout(debounce["throttle"])
  debounce["throttle"] = setTimeout(callback, delta)
}
