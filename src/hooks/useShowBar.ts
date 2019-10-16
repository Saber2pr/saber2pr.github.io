import { useState, useEffect } from "react"
import { musicStore } from "../store"
import { getHash } from "@saber2pr/react-router"

export const useShowBar = () => {
  const [show, setShow] = useState(musicStore.getState().music)
  useEffect(() => {
    const popstate = () => {
      if (getHash() === "/about" || getHash() === "/home") {
        setShow(false)
      } else {
        console.log(musicStore.getState().music)
        if (musicStore.getState().music) {
          setShow(true)
        } else {
          setShow(false)
        }
      }
    }
    window.addEventListener("popstate", popstate)
    return () => window.removeEventListener("popstate", popstate)
  }, [])
  return show
}
