import { useState } from "react"
import { musicStore } from "../store"
import { useEvent } from "./useEvent"
import { getHash } from "../utils"

export const useShowBar = () => {
  const [show, setShow] = useState(musicStore.getState().music)
  useEvent(
    "hashchange",
    () => {
      if (getHash() === "/关于") {
        setShow(false)
      } else {
        setShow(musicStore.getState().music)
      }
    },
    []
  )
  return show
}
