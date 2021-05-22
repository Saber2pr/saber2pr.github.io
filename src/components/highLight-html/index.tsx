import './style.less'

import React from 'react'
import ReactDOM from 'react-dom/server'

export interface HighLightHTML {
  source: string
  target: string
  transform?: (target: string) => string
  offset?: number
}

const transformHTML = (element: string) =>
  ReactDOM.renderToString(<>{element}</>)

export const HighLightHTML = ({
  source,
  target,
  offset = 20,
  transform = _ => _,
  ...props
}: HighLightHTML) => {
  let index = source.indexOf(target)
  let element: string
  if (index === -1) {
    const low = target.toLowerCase()
    index = source.indexOf(low)
    element = transform(low)
  } else {
    element = transform(target)
  }
  if (index === -1) {
    return <span className="HighLightHTML">{source.slice(0, offset * 2)}</span>
  }
  return (
    <span
      className="HighLightHTML"
      dangerouslySetInnerHTML={{
        __html:
          transformHTML(source.slice(index - offset, index)) +
          element +
          transformHTML(
            source.slice(index + target.length, index + target.length + offset)
          )
      }}
      {...props}
    />
  )
}
