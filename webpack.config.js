const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanCSSPlugin = require("less-plugin-clean-css")
const path = require("path")
const webpack = require("webpack")

const extractLess = new ExtractTextPlugin("style.min.css")
const { WebpackConfig, templateContent } = require("@saber2pr/webpack-configer")
const version = () =>
  `var version="Last Modified Time: ${new Date().toLocaleString()}"`

const auth = require("./auth/auth.json")

const client = () =>
  `var client_id="${auth.client_id}";var client_secret="${auth.client_secret}";`

module.exports = WebpackConfig({
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    filename: "bundle.min.js",
    path: path.join(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["ts-loader"]
      },
      {
        test: /\.(css|less)$/,
        use: extractLess.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "less-loader",
              options: {
                plugins: [
                  new CleanCSSPlugin({
                    advanced: true
                  })
                ]
              }
            }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(woff|svg|eot|ttf|png)$/,
        use: ["url-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: templateContent("saber2prの窝", {
        injectHead: '<link rel="manifest" href="./manifest.json" />',
        injectBody: '<div id="root"></div>'
      })
    }),
    extractLess,
    new webpack.BannerPlugin({
      banner: `${version()};console.log(version);${client()}`,
      raw: true,
      test: /\.js/
    })
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  }
})
