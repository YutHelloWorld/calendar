const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const __DEV__ = process.env.NODE_ENV === 'development'
const __PROD__ = process.env.NODE_ENV === 'production'

const config = {
  entry: './example/src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: __DEV__ ? 'bundle.js' : 'bundle.[chunkhash].js',
    publicPath: __DEV__ ? '/' : '/calendar/'
  },
  devtool: __DEV__ ? 'cheap-module-source-map' : 'source-map',
  module: {
    rules: [
      { test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader' // 将 JS 字符串生成为 style 节点
        }, {
          loader: 'css-loader' // 将 CSS 转化成 CommonJS 模块
        }, {
          loader: 'sass-loader' // 将 Sass 编译成 CSS
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }))
  ],
  stats: {
    colors: true,
    modules: false,
  }
}

config.plugins.push(new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'example', 'index.html'),
  inject: true,
  minify: {
    collapseWhitespace: true,
  },
}))

if (__DEV__) {
  config.devServer = {
    contentBase: path.resolve(__dirname, 'example'),
    compress: true,
    stats: {
      colors: true,
      modules: false,
    }
  }
}

if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
      },
    })
  )
}

module.exports = config
