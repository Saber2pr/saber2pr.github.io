const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanCSSPlugin = require("less-plugin-clean-css")
const path = require("path")

const extractLess = new ExtractTextPlugin("style.min.css")

const { WebpackConfig, templateContent } = require("@saber2pr/webpack-configer")

const script = `<script>var lastDate="${new Date().toLocaleString()}";</script>`

let template

if (process.env.NODE_ENV === "development") {
  template = templateContent("saber2prの窝", {
    injectHead: script,
    injectBody: '<div id="root"></div>'
  })
} else {
  template = templateContent("saber2prの窝", {
    injectBody: '<div id="root"></div>'
  })
}

module.exports = WebpackConfig({
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    filename: "bundle.min.js",
    path: path.join(__dirname, "template")
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
        test: /\.(woff|svg|eot|ttf)$/,
        use: ["url-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: template
    }),
    extractLess
  ]
})
