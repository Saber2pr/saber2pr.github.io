/*
 * @Author: saber2pr
 * @Date: 2019-06-12 10:35:34
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-06-12 15:25:59
 */
import React, { useState, useRef, CSSProperties } from "react"

export interface DefaultProps {
  className?: string
  alt?: string
}

const useDefault = ({
  className,
  alt
}: DefaultProps): [JSX.Element, VoidFunction] => {
  const defaultImg = <div className={className}>{alt}</div>

  const [body, alter] = useState(defaultImg)

  const destory = () => alter(null)

  return [body, destory]
}

export interface PreImg
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  defaultClassName?: string
}

export const PreImg = ({ defaultClassName, onLoad, alt, ...props }: PreImg) => {
  const [defaultImg, destory] = useDefault({ className: defaultClassName, alt })
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
