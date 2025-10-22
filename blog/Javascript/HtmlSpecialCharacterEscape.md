### Use regular escape
The exec method of the regular object (global g) can be used to iterate through the search string and record the matching position to the lastIndex attribute
1. Using split to disassemble a string into character sequences
two。 Modify the corresponding elements of the sequence according to the matched index
3. Use join to reverse the order of strings
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
### Using dom innerText to escape
```js
// innerText输入,innerHTML输出
const transform1 = element => {
  const dom = document.createElement("span")
  dom.innerText = element
  return dom.innerHTML
}

console.log(transform1(element))
```
### Using react-dom/server
Use the renderToString/XSS processing of ReactDOM.
```tsx
import ReactDOM from "react-dom/server"

const transformHTML = element => ReactDOM.renderToString(<>{element}</>)
```