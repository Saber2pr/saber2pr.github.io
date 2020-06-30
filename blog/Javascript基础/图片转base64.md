### 场景

safari 不支持 webp 格式图片，所以需要转为 base64 显示。

### 原理

利用 XMLHttpRequest 请求到 blob 资源，然后利用 FileReader 将 blob 转为 DataURL

```ts
export const parseBase64 = (imgUrl: string) =>
  new Promise<string>((resolve) => {
    window.URL = window.URL || window.webkitURL

    const xhr = new XMLHttpRequest()
    xhr.open('get', imgUrl, true)
    xhr.responseType = 'blob'

    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const blob = xhr.response
        const reader = new FileReader()
        reader.onloadend = (e) => {
          resolve(e.target.result as string)
        }
        reader.readAsDataURL(blob)
      }
    }

    xhr.send()
  })
```

### React 组件

根据 src 字符串判断是否为 webp 资源，然后转为 base64 图。

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
