### 利用正则转义

正则对象(全局 g)的 exec 方法可用来迭代搜索字符串，并把匹配到的位置记录到 lastIndex 属性

1. 利用 split 把字符串拆解成字符序列
2. 根据匹配到的 index 修改序列对应元素
3. 利用 join 反序列为字符串

```js
const element = `<script>hello</script>`

const transform0 = element => {
  // 得到字符序列
  const words = element.split("")
  const reg = /<|>/g
  let res = reg.exec(element)
  while (res) {
    // 匹配到的位置会被记录到lastIndex属性，由于是从1开始，所以要-1
    const index = reg.lastIndex - 1
    // 修改序列对应元素
    words.splice(index, 1, element.charCodeAt(index))
    // 迭代搜索下一个位置
    res = reg.exec(element)
  }
  return words.join("")
}

console.log(transform0(element))
```

### 利用 dom innerText 转义

```js
// innerText输入,innerHTML输出
const transform1 = element => {
  const dom = document.createElement("span")
  dom.innerText = element
  return dom.innerHTML
}

console.log(transform1(element))
```

### 利用 react-dom/server

使用 ReactDOM 的 renderToString/XSS 处理。

```tsx
import ReactDOM from "react-dom/server"

const transformHTML = element => ReactDOM.renderToString(<>{element}</>)
```
