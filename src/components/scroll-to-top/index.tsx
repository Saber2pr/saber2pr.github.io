import React, { useState } from "react"
import "./style.less"
import { useEvent } from "../../hooks"
import { throttle } from "../../utils"

export interface ScrollToTop {}

const useNeedToTop = () => {
  const [state, setState] = useState(false)
  const d = document.documentElement
  useEvent("scroll", () => {
    throttle(() => setState(d.scrollTop > d.clientHeight), 350)
  })
  return state
}

export const ScrollToTop = ({  }: ScrollToTop) => {
  const needToTop = useNeedToTop()
  if (needToTop) {
    return (
      <div
        className="ScrollToTop"
        onClick={() => {
          document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }}
      >
        顶部
      </div>
    )
  }

  return <></>
}
