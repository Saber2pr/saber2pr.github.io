import React from "react"
import ReactDOM from "react-dom/server"
import "./style.less"

export interface HighLightHTML {
  source: string
  target: string
  offset?: number
  highClassName?: string
}

const transform = (element: string) => ReactDOM.renderToString(<>{element}</>)

export const HighLightHTML = ({
  source,
  target,
  offset: offsetLeft = 20,
  highClassName,
  ...props
}: HighLightHTML) => {
  const index = source.indexOf(target)
  if (index === -1) return <></>
  return (
    <span
      className="HighLightHTML"
      dangerouslySetInnerHTML={{
        __html:
          transform(source.slice(index - offsetLeft, index)) +
          `<span class="${highClassName}">${target}</span>` +
          transform(source.slice(index + target.length))
      }}
      {...props}
    />
  )
}
