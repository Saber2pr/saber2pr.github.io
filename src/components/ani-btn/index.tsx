import './style.less'

import React, { useImperativeHandle, useRef } from 'react'

import { Icon } from '../../iconfont'

export interface AniBtn {
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const AniBtn = React.forwardRef(({ onClick }: AniBtn, ref) => {
  const isOpen = useRef(false)
  const topRef = useRef<HTMLDivElement>()
  const btmRef = useRef<HTMLDivElement>()

  const css = {
    toBtm: "translate(0%, 13px)",
    toTop: "translate(0%, -13px)",
    default: "translate(0%, 0%)"
  }

  const open = () => {
    topRef.current.style.transform = css.toBtm
    btmRef.current.style.transform = css.toTop
    return true
  }

  const close = () => {
    topRef.current.style.transform = css.default
    btmRef.current.style.transform = css.default
    return false
  }

  useImperativeHandle(ref, () => ({
    close: () => {
      isOpen.current = close()
    }
  }))

  return (
    <div
      className="AniBtn"
      onClick={event => {
        onClick && onClick(event)
        isOpen.current = isOpen.current ? close() : open()
      }}
    >
      <div className="AniBtn-Col">
        <div className="AniBtn-Btn" ref={topRef}>
          <Icon.BtnTop />
        </div>
        <div className="AniBtn-Btn" ref={btmRef}>
          <Icon.BtnBtm />
        </div>
      </div>
    </div>
  )
})
