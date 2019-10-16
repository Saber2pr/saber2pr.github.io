import { useState, useEffect } from "react"
import { musicStore } from "../store"
import { getHash } from "@saber2pr/react-router"

export const useShowBar = () => {
  const [show, setShow] = useState(musicStore.getState().music)
  useEffect(() => {
    const hashchange = () => {
      if (getHash() === "/about" || getHash() === "/home") {
        setShow(false)
      } else {
        setShow(musicStore.getState().music)
      }
    }
    window.addEventListener("hashchange", hashchange)
    return () => window.removeEventListener("hashchange", hashchange)
  }, [])
  return show
}
