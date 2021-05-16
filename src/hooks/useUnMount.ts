import { useEffect } from 'react'

export const useUnMount = (effect: VoidFunction, deps: readonly any[] = []) =>
  useEffect(() => effect, deps)
