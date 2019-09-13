import React from "react"

export function LogProps<T>(
  Component: (props: T) => JSX.Element,
  message = ""
) {
  return (props: T) => {
    console.log(message, props)
    return <Component {...props} />
  }
}
