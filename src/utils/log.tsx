import React from 'react'

import { createASCII } from './createASCII'

export function LogProps<T>(
  Component: (props: T) => JSX.Element,
  message = ""
) {
  return (props: T) => {
    console.log(message, props)
    return <Component {...props} />
  }
}

export function welcome() {
  console.log(createASCII(`from: ${location.origin}`))
}
