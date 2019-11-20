import React from "react"
import { timeout, whenInDEV } from "../../utils"

export interface LazyCom<T> {
  await: Promise<T>
  fallback: React.ReactNode
  children: (response: T) => JSX.Element
}

export function LazyCom<T>({ children, await: wait, fallback }: LazyCom<T>) {
  const Com = React.lazy(async () => {
    const com = await wait
    if (whenInDEV()) await timeout()
    return {
      default: () => children(com)
    }
  })
  return (
    <React.Suspense fallback={fallback}>
      <Com />
    </React.Suspense>
  )
}
