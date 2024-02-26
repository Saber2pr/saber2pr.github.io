Uploading pictures belongs to file upload, that is, using input:file.
```html
<input type="file" multiple onChange="callback" />
```
> multiple means multiple upload options are available. But only the IOS system is valid.
### OnChange processes files
```ts
const onChange = e => {
  const files = e.target.files
  Promise.all(
    Array.from(files).map(file =>
      readFile(file).then(base64Str => axios.post("xxx", { body: base64Str }))
    )
  )
}
```
> the type of files is FileList, which is a pseudo array.
ReadFile is the encapsulation of FileReader
```ts
const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener("load", () => resolve(reader.result.toString()))
    reader.addEventListener("error", () => reject(reader.result))
  })
```