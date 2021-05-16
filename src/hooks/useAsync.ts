import { useEffect, useState } from 'react'

export const useAsync = <T>(p: () => Promise<T>, initState?: T) => {
  const [state, setState] = useState(initState)

  useEffect(() => {
    p().then(setState)
  }, [])

  return state
}
