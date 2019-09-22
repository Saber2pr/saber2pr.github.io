import React from "react"

export interface LazyCom<T> {
  await: Promise<T>
  fallback: React.ReactNode
  children: (response: T) => JSX.Element
}

export function LazyCom<T>({ children, await: wait, fallback }: LazyCom<T>) {
  const Com = React.lazy(async () => {
    const com = await wait
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
