路由主要根据 IncomingMessage.url 来区分

例如要处理 /user 路由的 GET 和 POST 请求：

```ts
createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url.startsWith("/user")) {
      res.end("get ok.")
    }
  } else if (req.method === "POST") {
    if (req.url.startsWith("/user")) {
      res.end("post ok.")
    }
  } else {
    res.end("404")
  }
})
```

调用 res.end()结束此次 HTTP 会话。

分支比较复杂，所以借助一些库会好一些。
