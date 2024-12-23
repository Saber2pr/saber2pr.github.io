```ts
const timeout = (delay = 1000) =>
  new Promise(resolve => setTimeout(resolve, delay))

export interface TryAsyncOps<T> {
  times?: number
  checkRes?: (res: T) => boolean
}

export const tryAsync = async <T>(
  fn: () => Promise<T>,
  ops: TryAsyncOps<T> = {} as any
): Promise<T> => {
  const max = ops?.times ?? 10
  const checkRes = ops?.checkRes ?? (_ => !!_)

  let current = 0

  const work = async () => {
    let res = null
    let err = null
    try {
      res = await fn()
    } catch (error) {
      err = error
    }

    if (checkRes(res)) {
      return res
    }

    current++
    if (current > max) {
      console.log(`请求失败，请检查服务器网络是否正常`, err)
      return
    }
    await timeout(2000)
    console.log(`请求失败，正在重试 ${current}/${max}, `, err)
    return await work()
  }

  return await work()
}
```