import { useEffect, useRef, useState } from 'react'

import { useIsMobile } from './useIsMobile'

const show_ref = { current: true }

export const useAsideHidable = (
  aside_ref: React.MutableRefObject<HTMLDivElement>
): [
  React.MutableRefObject<HTMLDivElement>,
  React.MutableRefObject<HTMLDivElement>,
  (value?: boolean) => void,
  boolean
] => {
  const main_ref = useRef<HTMLDivElement>()
  const btn_ref = useRef<HTMLDivElement>()
  const hidden = () => {
    main_ref.current.style.width = "80%"
    main_ref.current.style.margin = "0 auto"
    aside_ref.current.style.width = "0"
    btn_ref.current.style.right = "0"
    btn_ref.current.title = '展开'
  }

  const show = () => {
    main_ref.current.style.width = "70%"
    main_ref.current.style.margin = "0"
    aside_ref.current.style.width = "30%"
    btn_ref.current.style.right = "auto"
    btn_ref.current.title = '收起'
  }

  const [isShow, setIsShow] = useState(show_ref.current)

  const select = (value = isShow) => {
    if (value) {
      hidden()
      setIsShow(false)
      show_ref.current = false
    } else {
      show()
      setIsShow(true)
      show_ref.current = true
    }
  }

  useEffect(() => {
    if (document.documentElement.clientWidth < 760) return
    show_ref.current ? show() : hidden()
  }, [])

  useIsMobile(
    () => {
      main_ref.current.style.width = "auto"
      aside_ref.current.style.width = "auto"
      btn_ref.current.style.display = "none"
    },
    () => {
      btn_ref.current.style.display = "block"
      if (isShow) {
        show()
      } else {
        hidden()
      }
    }
  )

  return [main_ref, btn_ref, select, isShow]
}
