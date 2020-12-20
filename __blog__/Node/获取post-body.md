body 用来传输长字节，需要分片接收。

1. 监听 IncomingMessage data 事件，收集 body 碎片。

2. 监听 IncomingMessage end 事件，接收完毕。

```ts
const getBody = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    const data = []
    req.on("data", chunk => data.push(chunk))
    req.on("end", () => resolve(data.join("")))
    req.on("error", err => reject(err))
  })
```
