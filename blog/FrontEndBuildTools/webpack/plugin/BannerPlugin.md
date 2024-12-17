[webpack 内置插件]

用来在 bundle 顶层添加字符串。

1. 以注释形式添加

```js
const webpack = require("webpack")

module.exports = {
  plugins: [new webpack.BannerPlugin("copyright saber2pr.")]
}
```

1. 以代码形式添加

```js
const webpack = require("webpack")

module.exports = {
  plugins: [
    new webpack.BannerPlugin({
      banner: `console.log('copyright saber2pr.')`,
      raw: true,
      test: /\.js/
    })
  ]
}
```
