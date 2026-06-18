```tsx
import React from 'react'

export const resolveImgSrc = (src: string, cdn = false) => {
  if (cdn) {
    return `${ApiConfig.static}/img/${src}`
  }
  return src
}

export interface ImgProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  /**
   * 未放到cdn时可以使用本地static
   */
  devForImg?: boolean
  cdn?: boolean
  forwardRef?: any
}

/**
 * 为方便后期图片资源懒加载、转移cdn等,所以使用封装后的Img
 */
export const Img = ({
  src = '',
  devForImg = false,
  cdn = false,
  forwardRef,
  ...props
}: ImgProps) => {
  return (
    <img
      ref={forwardRef}
      {...props}
      src={devForImg ? src : resolveImgSrc(src, cdn)}
    />
  )
}


export interface ImgBindHover extends ImgProps {
  hoverSrc?: string
  getBindTarget?(): HTMLElement
}

export const ImgBindHover = ({
  src,
  hoverSrc = src,
  getBindTarget,
  ...props
}: ImgBindHover) => {
  const [displaySrc, setDisplaySrc] = useState(src)

  const ref = useRef<HTMLImageElement>()

  useEffect(() => {
    const onMouseEnter = () => {
      setDisplaySrc(hoverSrc)
    }
    const onMouseLeave = () => {
      setDisplaySrc(src)
    }
    const target = getBindTarget ? getBindTarget() : ref.current
    if (target) {
      target.addEventListener('mouseenter', onMouseEnter)
      target.addEventListener('mouseleave', onMouseLeave)
    }
    return () => {
      if (target) {
        target.removeEventListener('mouseenter', onMouseEnter)
        target.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [])

  return <Img forwardRef={ref} {...props} src={displaySrc} />
}

```