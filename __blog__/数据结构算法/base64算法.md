base64 是一种用 64 个字符（1 字节 = 8bit）来表示任意 8bit 位的二进制数据的方法。
base64 一共只有 2 的 6 次方 64 个字符（6bit），而实际上 1 bytes = 8bit
将二进制数据每 6bit 位替换成一个 base64 字符

```js
function base64encode(text) {
  let code = ""
  let base64Code =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let res = ""

  for (let i of text) {
    let char = i.charCodeAt().toString(2)
    // 将 toString 前面省略的0补上，补够8位二进制
    for (let a = 0; a <= 8 - char.length; a++) {
      char = 0 + char
    }
    code += char
  }
  // 不足 24 bit (也就是 3 bytes) 的情况进行特殊处理
  // 只有 1 字节的时候
  if (code.length % 24 === 8) {
    // 补齐到 2*6 = 12 bit
    code += "0000"
    // 剩余缺失的 2 个 base64 字符用等号代替
    res += "=="
  }
  // 只有 2 字节的时候
  if (code.length % 24 === 16) {
    // 补齐到 3 * 6 = 18 bit
    code += "00"
    // 剩余缺失的 1 个 base64 字符用等号代替
    res += "="
  }

  let encode = ""
  for (let i = 0; i < code.length; i += 6) {
    let item = code.slice(i, i + 6)
    encode += base64Code[parseInt(item, 2)]
  }

  return encode + res
}

console.log(base64encode("this is a example")) // dGhpcyBpcyBhIGV4YW1wbGU=
```
