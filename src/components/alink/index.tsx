import React, { useState, useEffect } from "react"
import { Link } from "@saber2pr/react-router"
import { store } from "../../store"
import { origin } from "../../config"

export interface ALink extends Link {
  act: string
  uact: string
}

export const ALink = ({ act, uact, onClick, ...props }: ALink) => {
  const [className, set] = useState(uact)
  const BLOG = store.getState().blogRoot
  useEffect(() =>
    store.subscribe(() => {
      const current = store.getState().href
      const path = props.to
      if (current === path) {
        set(act)
      } else {
        if (props.to === BLOG && current.startsWith(origin.md)) {
          set(act)
        } else {
          set(uact)
        }
      }
    })
  )
  return (
    <Link
      {...props}
      className={
        props.className ? `${props.className} ${className}` : className
      }
      href=""
      onClick={event => {
        onClick && onClick(event)
        store.dispatch("href", props.to)
      }}
    />
  )
}
