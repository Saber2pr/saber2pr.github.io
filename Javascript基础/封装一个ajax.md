```js
/**
 * @param {string} url
 * @param {string} method
 * @param {object} params
 * @returns
 */
function request(url, method = "GET", params = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject({
            code: xhr.status,
            response: xhr.response
          })
        }
      }
    })
    setTimeout(() => reject("timeout:1000"), 1000)
    xhr.send(JSON.stringify(params))
  })
}

request("http://localhost:3005/user/?name=saber&age=21").then(console.log)
request("http://localhost:3005/user/", "POST", {
  name: "saber",
  age: 233
}).then(console.log)

request("http://localhost:30051/user/?name=saber&age=21").then(console.log)
request("http://localhost:30051/user/", "POST", {
  name: "saber",
  age: 233
}).then(console.log)
```

# onreadystatechange

每当 readyState 属性改变时，就会调用该函数

### readyState

0. 请求未初始化
1. 服务器连接已建立
2. 请求已接收
3. 请求处理中
4. 请求已完成，且响应已就绪

### status http 状态码

1xx: 请求正在处理
2xx: 请求处理完毕
3xx: 重定向
4xx: 浏览器端（客户端）错误
5xx: 服务器内部错误
