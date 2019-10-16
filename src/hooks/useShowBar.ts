import { useState } from "react"
import { musicStore } from "../store"
import { getHash } from "@saber2pr/react-router"
import { useEvent } from "./useEvent"

export const useShowBar = () => {
  const [show, setShow] = useState(musicStore.getState().music)
  useEvent(
    "hashchange",
    () => {
      if (getHash() === "/about" || getHash() === "/home") {
        setShow(false)
      } else {
        setShow(musicStore.getState().music)
      }
    },
    []
  )
  return show
}
