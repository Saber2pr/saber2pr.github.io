const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanCSSPlugin = require("less-plugin-clean-css");
const path = require("path");

const extractLess = new ExtractTextPlugin("style.min.css");

const {
  WebpackConfig,
  templateContent
} = require("@saber2pr/webpack-configer");

const App = {
  JHome: JSON.stringify(require("./data/home.json")),
  JBlog: JSON.stringify(require("./data/blogs.json")),
  JAbout: JSON.stringify(require("./data/abouts.json")),
  JProject: JSON.stringify(require("./data/projects.json")),
  JLinks: JSON.stringify(require("./data/links.json"))
};

const script = `<script>var JHome=${App.JHome};var JBlog=${
  App.JBlog
};var JAbout=${App.JAbout};var JProject=${App.JProject};var JLinks=${
  App.JLinks
}</script>`;

let template;

if (process.env.NODE_ENV === "development") {
  template = templateContent("saber2prの窝", {
    injectHead: script,
    injectBody: '<div id="root"></div>'
  });
} else {
  template = templateContent("saber2prの窝", {
    injectBody: '<div id="root"></div>'
  });
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
});
