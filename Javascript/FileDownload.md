```js
const download = () => {
    const blob = new Blob(['内容文本'])
    a.download = '文件名.md'
    a.href = URL.createObjectURL(blob)
    a.click()
}
```