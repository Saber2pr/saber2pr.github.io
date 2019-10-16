import { useState, useEffect } from "react"
import { store } from "../store"
import { getHash } from "@saber2pr/react-router"

export const useShowBar = () => {
  const [show, setShow] = useState(store.getState().music)
  useEffect(
    () =>
      store.subscribe(() => {
        getHash() === "/about" || getHash() === "/home"
          ? setShow(false)
          : setShow(store.getState().music)
      }),
    [show]
  )
  return show
}
