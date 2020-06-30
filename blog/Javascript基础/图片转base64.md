### 场景

safari不支持webp格式图片，所以需要转为base64显示。

### 原理

利用XMLHttpRequest请求到blob资源，然后利用FileReader将blob转为DataURL

```ts
export const parseBase64 = (imgUrl: string) =>
  new Promise<string>(resolve => {
    window.URL = window.URL || window.webkitURL

    const xhr = new XMLHttpRequest()
    xhr.open('get', imgUrl, true)
    xhr.responseType = 'blob'

    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const blob = xhr.response
        const reader = new FileReader()
        reader.onloadend = e => {
          resolve(e.target.result as string)
        }
        reader.readAsDataURL(blob)
      }
    }

    xhr.send()
  })
```

### React组件

根据src字符串判断是否为webp资源，然后转为base64图。

 ```tsx
 export interface Img
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export const Img = ({ src, ...props }: Img) => {
  const [srcStr, setSrc] = useState(src)

  useEffect(() => {
    if (/\.webp/.test(src)) {
      parseBase64(src).then(setSrc)
    } else {
      setSrc(src)
    }
  }, [src])

  return <img {...props} src={srcStr} />
}
 ```
