/*
 * @Author: saber2pr
 * @Date: 2019-06-12 10:35:34
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-06-12 15:25:59
 */
import React, { useState, useRef, CSSProperties } from "react"
import { usePreComp } from "../../hooks"

export interface DefaultProps {
  className?: string
  alt?: string
}

export interface PreImg
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  fallback?: JSX.Element
}

export const PreImg = ({ fallback, onLoad, alt, ...props }: PreImg) => {
  const [defaultImg, destory] = usePreComp(fallback)
  const ref = useRef<HTMLImageElement>()
  const [style, setStyle] = useState<CSSProperties>({ display: "none" })
  const visu = () => setStyle({ display: "inline" })
  return (
    <>
      {defaultImg}
      <img
        {...props}
        style={style}
        ref={ref}
        onError={() => ref.current.remove()}
        onLoad={event => {
          destory()
          visu()
          onLoad && onLoad(event)
        }}
      />
    </>
  )
}
