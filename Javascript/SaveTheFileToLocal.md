Using the a tag
> e download attribute is the save file name
```ts
export function download(url: string, name = new Date().toLocaleString()) {
  const anchor = document.createElement("a")
  anchor.download = name
  anchor.href = url
  anchor.click()
  anchor.remove()
}
```
### Download url
1. Canvas.toDataURL ()
2. URL.createObjectURL (Blob | File)