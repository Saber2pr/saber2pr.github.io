import React from 'react'

import { timeout, whenInDEV } from '../../utils'

export interface LazyCom<T> {
  await: Promise<T>
  fallback: React.ReactNode
  errorBack?: React.ReactNode
  children: (response: T) => JSX.Element
}

export function LazyCom<T>({
  children,
  await: wait,
  fallback,
  errorBack
}: LazyCom<T>) {
  const Com = React.lazy(async () => {
    try {
      const com = await wait
      if (whenInDEV()) await timeout()
      return {
        default: () => children(com)
      }
    } catch (error) {
      return {
        default: () => <>{errorBack}</>
      }
    }
  })
  return (
    <React.Suspense fallback={fallback}>
      <Com />
    </React.Suspense>
  )
}
