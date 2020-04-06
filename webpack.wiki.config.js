const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
const webpack = require("webpack")

const { WebpackConfig, templateContent } = require("@saber2pr/webpack-configer")
const version = () => `var version="${new Date().toLocaleString()}"`

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + "/"

module.exports = WebpackConfig({
  entry: {
    index: "./src/wiki.tsx"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    filename: "wiki.min.js",
    path: path.join(__dirname, "release"),
    publicPath: "/release"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["ts-loader"]
      },
      {
        test: /\.(woff|svg|eot|ttf|png)$/,
        use: ["url-loader"]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath }
          },
          "css-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath }
          },
          "css-loader",
          "less-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: templateContent("saber2prの窝", {
        injectHead: `<link rel="manifest" href="./manifest.json" /><script src="https://saber2pr.top/loading/index.min.js"></script><script async src="https://saber2pr.top/click-mask/click-mask.min.js"></script><script async src="https://saber2pr.top/test/tools/debug.min.js"></script>`,
        injectBody: `<div id="root"></div><script>LOADING.init();</script>`
      })
    }),
    new webpack.BannerPlugin({
      banner: `${version()};`,
      raw: true,
      test: /\.js/
    }),
    new MiniCssExtractPlugin({
      filename: "wiki.min.css"
    })
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  }
})
