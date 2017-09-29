const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'example', 'src', 'index.jsx'),
  output: {
    path: '/dist',
    filename: 'bundle.js',
  },
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
  devServer: {
    contentBase: path.join(__dirname, 'example'),
    compress: true,
  }
}
