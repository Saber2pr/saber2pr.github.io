import { useEffect, useRef } from 'react'

export const useAniLayout = (): [
  React.MutableRefObject<HTMLDivElement>,
  () => boolean,
  (animate?: boolean) => boolean
] => {
  const ref = useRef<HTMLDivElement>()

  const open = () => {
    clearTimeout(open["ani"])
    ref.current.style.display = "block"
    open["ani"] = setTimeout(() => {
      if (ref.current) ref.current.style.opacity = "1"
    }, 400)
    return true
  }
  const close = (animate = true) => {
    clearTimeout(close["ani"])
    if (animate) {
      ref.current.style.animation = "opacityMoveDown 0.5s ease"
      close["ani"] = setTimeout(() => {
        ref.current.style.display = "none"
        ref.current.style.animation = "opacityMoveUp 0.5s ease"
        ref.current.style.willChange = "auto"
      }, 400)
    } else {
      ref.current.style.display = "none"
    }
    return false
  }

  useEffect(
    () => () => {
      clearTimeout(close["ani"])
      clearTimeout(open["ani"])
    },
    []
  )

  return [ref, open, close]
}
