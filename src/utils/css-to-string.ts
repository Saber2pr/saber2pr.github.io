import { CSSProperties } from 'react'

export function toLowerCase(value: string) {
  return value.replace(/\B([A-Z])/g, "-$1").toLowerCase()
}

export const cssToString = (style: CSSProperties) =>
  Object.entries(style).reduce(
    (receiver, [k, v]) => receiver.concat(`${toLowerCase(k)}:${v};`),
    ""
  )
