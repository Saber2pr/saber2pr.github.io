const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')
const inlinejs = require('./inlinejs.json')
const config = require('./app.json')

const { WebpackConfig, templateContent } = require('@saber2pr/webpack-configer')
const version = () => `var version="${new Date().toLocaleString()}"`

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + '/'

const cdnhost = `//cdn.jsdelivr.net/gh/${config.userId}`

module.exports = WebpackConfig({
  entry: {
    index: './src/index.tsx',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    filename: '[name][hash].min.js',
    path: path.join(__dirname, 'build'),
    publicPath:
      process.env.NODE_ENV === 'production'
        ? `${cdnhost}/${config.repo}@master/build/`
        : '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ['ts-loader'],
      },
      {
        test: /\.(woff|svg|eot|ttf|png)$/,
        use: ['url-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath },
          },
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath },
          },
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: templateContent(config.title, {
        injectHead: `
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        <meta name="keywords" content="react,antd,typescript,javascript,css,html,前端学习,前端进阶,个人博客">
        <meta name="description" content="长期更新前端技术文章,分享前端技术经验">
        <link rel="manifest" href="./manifest.json" />
        <script async src="//cdn.jsdelivr.net/gh/saber2pr/click-mask@master/click-mask.min.js"></script>
        <script async src="//cdn.jsdelivr.net/gh/saber2pr/test@master/tools/debug.min.js"></script>
        <script async src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
        ${Object.keys(inlinejs).map(
          key =>
            `<script type="text/javascript" id="${key}">${inlinejs[key]}</script>`
        )}
        `,
        injectBody:
          `<div id="root"></div><script>LOADING.init(` +
          `"努力加载中qwq，请稍等..."` +
          ', 1000);</script>',
      }),
    }),
    new webpack.BannerPlugin({
      banner: `${version()};`,
      raw: true,
      test: /\.js/,
    }),
    new MiniCssExtractPlugin({
      filename: '[name][hash].css',
      chunkFilename: 'style.[id][hash].css',
    }),
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 200000,
      maxSize: 250000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
})
