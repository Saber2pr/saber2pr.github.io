import { useEffect, useState } from 'react'

import { store } from '../store/index'

export const useShowMusic = () => {
  const [showMusic, setShowMusic] = useState(store.getState().showMusic)
  useEffect(
    // @ts-ignore
    () => store.subscribe(() => setShowMusic(store.getState().showMusic)),
    []
  )
  return showMusic
}
