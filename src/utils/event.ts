export class Dispatcher {
  constructor() { }
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

  public dispatch(type: string, message?: any) {
    const listeners = this.events[type] || []
    for (const listener of listeners) {
      listener(message)
    }
  }
}