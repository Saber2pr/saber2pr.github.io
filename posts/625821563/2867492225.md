The front end uses FileReader to serialize the picture File object into a base64 string, which is then sent to the POST body and sent to the back end.
The backend receives the binary of the base64 string and needs to use Buffer to convert it to base64 and then write it to the file.
```ts
if (ctx.request.method === "POST") {
  const body = await getBody(ctx.request) // 接收二进制数据
  const buffer = Buffer.from(body, "base64") // 转为base64
  await addFile(ctx.base + ctx.request.url, buffer) // 写入文件
  ctx.response.end()
}
```