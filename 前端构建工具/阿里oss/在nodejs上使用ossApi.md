1. 安装 ali-oss：

[ali-oss 文档](https://github.com/ali-sdk/ali-oss?spm=a2c63.p38356.879954.12.5534386bfcu0CP#summary)

```bash
yarn add ali-oss
```

2. 连接 OSS：

```js
const client = new OSS({
  accessKeyId: 'xxx',
  accessKeySecret: 'yyy',
  bucket: 'your-bucket',
  region: 'oss-cn-hangzhou',
})
```

3. 上传文件

> put(路径，Buffer)

```js
const buf = await promisify(readFile)('./hello.txt')
await client.put(`/dir/test.txt`, buf)
```
