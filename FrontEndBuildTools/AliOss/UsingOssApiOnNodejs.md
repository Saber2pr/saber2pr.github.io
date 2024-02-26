1. Install ali-oss:
[ali-oss documentation](https://github.com/ali-sdk/ali-oss?spm=a2c63.p38356.879954.12.5534386bfcu0CP#summary)
```bash
yarn add ali-oss
```
two。 Connect to the OSS:
```js
const client = new OSS({
  accessKeyId: 'xxx',
  accessKeySecret: 'yyy',
  bucket: 'your-bucket',
  region: 'oss-cn-hangzhou',
})
```
3. Upload files
> put (path, Buffer)
```js
const buf = await promisify(readFile)('./hello.txt')
await client.put(`/dir/test.txt`, buf)
```