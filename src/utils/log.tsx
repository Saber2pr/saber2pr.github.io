import React from "react"
import { createASCII } from "./createASCII"
import { origin } from "../config"

export function LogProps<T>(
  Component: (props: T) => JSX.Element,
  message = ""
) {
  return (props: T) => {
    console.log(message, props)
    return <Component {...props} />
  }
}

export const welcome = (lastDate: string) =>
  console.log(
    createASCII(
      `from: ${origin.root}
    ---Last Modified Time: ${lastDate}---`
    )
  )
