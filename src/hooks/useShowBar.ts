import { useState, useEffect } from "react"
import { store } from "../store"
import { usePush } from "@saber2pr/router"

export const useShowBar = () => {
  const [_, getHref] = usePush()
  const [show, setShow] = useState(store.getState().music)
  useEffect(
    () =>
      store.subscribe(() => {
        getHref() === "/about" || getHref() === "/home"
          ? setShow(false)
          : setShow(store.getState().music)
      }),
    [show]
  )
  return show
}
