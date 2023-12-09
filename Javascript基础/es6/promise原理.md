promise本质是Monad，用于在纯函数中处理副作用。

> 在Node.js上常用来处理callback-hell。其实是利用了promise暴露的executor。

Monad依赖系统实现的微任务队列，用于在纯函数执行后执行副作用。

# 微任务

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

> 兼容Node.js和Browser环境

# Promise实现

### 类型定义

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

### 实现

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

### then实现

将普通值类型提升为Promise类型

es6实现中，将>>=操作和lift操作在if中分情况合并了。

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

至于async/await那就真的是语法糖了。就是haskell中的do block。

es6中可以利用yield和promise实现。