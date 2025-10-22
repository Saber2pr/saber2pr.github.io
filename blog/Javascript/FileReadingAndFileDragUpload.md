```js
const readFile = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.result)
        reader.readAsText(file)
    })

const addUploadListener = callback => {
    document.addEventListener("dragover", e => e.preventDefault())
    document.addEventListener("drop", event => {
        event.preventDefault()
        const dt = event.dataTransfer
        const file = dt.files[0]
        readFile(file).then(content =>
            callback({ name: file.name, type: file.type, content })
        )
    })
}
```