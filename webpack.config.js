const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')

const { WebpackConfig, templateContent } = require('@saber2pr/webpack-configer')
const version = () => `var version="${new Date().toLocaleString()}"`

const publicPath = (resourcePath, context) =>
  path.relative(path.dirname(resourcePath), context) + '/'

module.exports = WebpackConfig({
  entry: {
    index: './src/index.tsx',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    filename: '[name].min.js',
    path: path.join(__dirname, 'build'),
    publicPath: process.env.NODE_ENV === 'production' ? '/build' : '/',
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
      templateContent: templateContent('saber2prの窝', {
        injectHead: `
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        <meta name="keywords" content="react,antd,typescript,javascript,css,html,前端学习,前端进阶,个人博客">
        <meta name="description" content="长期更新前端技术文章,分享前端技术经验">
        <link rel="manifest" href="./manifest.json" />
        <script src="//saber2pr.top/loading/index.min.js"></script>
        <script async src="//saber2pr.top/click-mask/click-mask.min.js"></script>
        <script async src="//saber2pr.top/test/tools/debug.min.js"></script>
        <script src="//cdn.jsdelivr.net/npm/echarts@5.1.1/dist/echarts.min.js"></script>
        `,
        injectBody:
          `<div id="root"></div><script>LOADING.init(` +
          `"等待时间太长？访问[<a href='//saber2pr.gitee.io/'>加速版</a>]."` +
          ');</script>',
      }),
    }),
    new webpack.BannerPlugin({
      banner: `${version()};`,
      raw: true,
      test: /\.js/,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'style.[id].css',
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
