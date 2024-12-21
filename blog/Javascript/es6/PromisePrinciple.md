Promise is essentially Monad and is used to handle side effects in pure functions.
> it is often used to deal with callback-hell on Node.js. In fact, it takes advantage of the executor exposed by promise.
Monad relies on a system-implemented microtask queue to perform side effects after pure function execution.
# Micro task
```ts
export interface Microtask extends MutationCallback {}

export function microtask(task: Microtask) {
  if (
    typeof process !== 'undefined' &&
    typeof process.nextTick === 'function'
  ) {
    process.nextTick(task)
  } else {
    const observer = new MutationObserver(task)
    const element = document.createTextNode('')
    observer.observe(element, {
      characterData: true
    })
    element.data = ''
  }
}
```
> mpatible with Node.js and Browser environments
# Promise implementation
### Type definition
```ts
export type Resolve<T> = (value?: T) => any
export type Reject<T> = (reason?: T) => any

export type Executor<T> = (resolve: Resolve<T>, reject: Reject<T>) => void
export type Catch<T> = (onRejected: Reject<T>) => any

export type Then<T> = (
  onfulfilled?: Resolve<T>,
  onrejected?: Reject<T>
) => Promise<T>

export type Status = 'pending' | 'resolved' | 'rejected'
```
### Realize
```ts
export class Promise<T> {
  public constructor(executor: Executor<T>) {
    try {
      // 构造函数同步执行
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }
  private status: Status = 'pending'
  private data = undefined
  private onResolvedCallback: Array<Resolve<T>> = []
  private onRejectedCallback: Array<Reject<T>> = []

  // microtask中处理then注册的Callbacks
  private resolve: Resolve<T> = value => microtask(() => {
    if (this.status === 'pending') {
      this.status = 'resolved'
      this.data = value
      this.onResolvedCallback.forEach(resolve => resolve(value))
    }
  })
  private reject: Reject<T> = reason => microtask(() => {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.data = reason
      this.onRejectedCallback.forEach(reject => reject(reason))
    }
  })

  // 下文实现then
}

export namespace Promise {
  export function resolve<T>(value?: T) {
    return new Promise<T>(resolve => resolve(value))
  }

  export function reject<T>(reason?: T) {
    return new Promise<T>((_, reject) => reject(reason))
  }
}
```
### Then implementation
Promote normal value type to Promise type
In the es6 implementation, the > > = operation and the lift operation are merged separately in if.
```ts
export class Promise<T> {
  public then: Then<T> = (
    onfulfilled = value => value,
    onrejected = reason => {
      throw reason
    }
  ) => {
    // then返回新的Promise
    return new Promise((resolve, reject) => {
      if (this.status === 'resolved') {
        try {
          // 执行onfulfilled，然后将普通值提升为Promise类型
          // 下文都是这个步骤
          const p = onfulfilled(this.data)
          if (p instanceof Promise) {
            p.then(resolve, reject)
          } else {
            // 提升为Promise类型
            resolve(p)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (this.status === 'rejected') {
        try {
          const p = onrejected(this.data)
          if (p instanceof Promise) {
            p.then(resolve, reject)
          } else {
            reject(this.data)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (this.status === 'pending') {
        this.onResolvedCallback.push(() => {
          try {
            const p = onfulfilled(this.data)
            if (p instanceof Promise) {
              p.then(resolve, reject)
            } else {
              resolve(p)
            }
          } catch (error) {
            reject(error)
          }
        })

        this.onRejectedCallback.push(() => {
          try {
            const p = onrejected(this.data)
            if (p instanceof Promise) {
              p.then(resolve, reject)
            } else {
              reject(this.data)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
    })
  }

  // 注册一个onRejected到callbacks
  public catch = (onRejected: Reject<T>) => {
    return this.then(null, onRejected)
  }
}
```
As for async/await, it's really grammatical candy. It is the do block in haskell.
Yield and promise can be used in es6.