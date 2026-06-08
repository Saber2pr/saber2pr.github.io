### Scene
Safari does not support webp format images, so you need to convert to base64 display.
### Principle
Use XMLHttpRequest to request blob resources, and then use FileReader to convert blob into DataURL
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
### React component
Determine whether it is a webp resource based on the src string, and then convert it to a base64 diagram.
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