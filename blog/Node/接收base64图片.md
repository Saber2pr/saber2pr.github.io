前端使用 FileReader 可以将图片 File 对象序列化成 base64 字符串，然后放到 POST body 发送到后端。
后端接收到 base64 字符串的二进制，需要使用 Buffer 将其转为 base64 然后写入文件。

```ts
if (ctx.request.method === "POST") {
  const body = await getBody(ctx.request) // 接收二进制数据
  const buffer = Buffer.from(body, "base64") // 转为base64
  await addFile(ctx.base + ctx.request.url, buffer) // 写入文件
  ctx.response.end()
}
```
