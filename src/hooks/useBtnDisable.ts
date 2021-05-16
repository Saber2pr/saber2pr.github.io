import { useRef } from 'react'

export const useBtnDisable = (): [
  React.MutableRefObject<HTMLButtonElement>,
  (isDisable?: boolean) => void
] => {
  const ref = useRef<HTMLButtonElement>()
  const disable = () => {
    if (ref.current === null) return
    ref.current.disabled = true
    ref.current.style.cursor = "not-allowed"
    ref.current.style.opacity = "0.5"
  }
  const enable = () => {
    if (ref.current === null) return
    ref.current.disabled = false
    ref.current.style.cursor = "pointer"
    ref.current.style.opacity = "1"
  }

  return [ref, (isDisable = true) => (isDisable ? disable() : enable())]
}
