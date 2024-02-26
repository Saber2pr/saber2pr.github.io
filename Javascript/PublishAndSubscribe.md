```js
export class Dispatcher {
  private constructor() { }
  public static instance = new Dispatcher()
  private events: object = {}

  public addEventListener(type: string, listener: Function) {
    const listeners = this.events[type] || []
    listeners.push(listener)
    this.events[type] = listeners
  }

  public removeEventListener(type: string, listener: Function) {
    const listeners = this.events[type] || []
    const index = listeners.indexOf(listener)
    listeners.splice(index, 1)
  }

  public dispatch(type: string, message: any) {
    const listeners = this.events[type] || []
    for (const listener of listeners) {
      listener(message)
    }
  }
}
```
Stripped down version (js):
```js
const Eve = {
  events: {},
  on(type, listener) {
    const listeners = this.events[type] || []
    listeners.push(listener)
    this.events[type] = listeners
  },
  off(type, listener) {
    const listeners = this.events[type] || []
    const index = listeners.indexOf(listener)
    listeners.splice(index, 1)
  },
  emit(type, message) {
    const listeners = this.events[type] || []
    // 这里看情况，事件列表太长就不要slice
    for (const listener of listeners.slice()) {
      listener(message)
    }
  }
}
```