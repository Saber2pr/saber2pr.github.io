这里有一个 Nodejs 操作 mongodb 的示例：

[demo](https://github.com/Saber2pr/mongodb/blob/master/src/test/test.ts)

在 npm 上有操作 mongodb 的库，安装

```bash
yarn add mongodb @types/mongodb
```

> 本机需要安装 mongodb 数据库服务

mongodb 库的 api 风格还是 nodejs 一贯的末尾 callback 形式，虽然 nodejs 提供了工具函数 promisify 用来做转换，但很多 api 转换的效果并不好。

建议手工写 promise 转换 mongodb 库的 api。这里有一些：

[@saber2pr/mongodb](https://github.com/Saber2pr/mongodb)
