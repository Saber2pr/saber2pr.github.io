import React from "react"
import "./style.less"

export interface HighLightHTML {
  source: string
  target: string
  offset?: number
  highClassName?: string
}

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
          source.slice(index - offsetLeft, index) +
          `<span class="${highClassName}">${target}</span>` +
          source.slice(index + target.length)
      }}
      {...props}
    />
  )
}
