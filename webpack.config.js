const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const __DEV__ = process.env.NODE_ENV === 'development';
let config = {
  mode: __DEV__ ? 'development' : 'production',
  entry: './example/src/index', // 入口文件
  output: {
    filename: 'bundle.[hash:4].js', // 添加hash可以防止文件缓存，每次都会生成4位的hash串
    path: path.resolve('dist'), // 打包后的目录，必须是绝对路径
    publicPath: __DEV__ ? '/' : '/calendar/'
  },
  devtool: __DEV__ ? 'cheap-module-source-map' : 'source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        },
        utils: {
          // 抽离自己写的公共代码，utils这个名字可以随意起
          chunks: 'initial',
          name: 'utils', // 任意命名
          minSize: 0 // 只要超出0字节就生成一个新包
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.scss']
  },
  stats: {
    colors: true,
    modules: false
  }
};

config.module = {
  rules: [
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        // 将css用link的方式引入
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    },
    {
      test: /\.(jpe?g|png|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
            outputPath: 'images/' // 图片打包后存放的目录
          }
        }
      ]
    },
    {
      test: /\.(js|jsx)$/,
      include: /example/,
      exclude: /node_modules/,
      loader: 'babel-loader?cacheDirectory'
    },
    {
      test: /\.(eot|ttf|woff|svg)$/,
      use: 'file-loader'
    },
    {
      test: /\.(htm|html)$/,
      use: 'html-withimg-loader'
    }
  ]
};

config.plugins = [
  // 通过new一下这个类来使用插件
  new HtmlWebpackPlugin({
    // 用哪个html作为模板
    // 在 dist 目录下创建一个index.html页面当做模板来用
    template: './example/index.html',
    hash: true // 会在打包好的bundle.js 后面加上 hash串
  }),
  // // 拆分后会把 css 文件放到 dist 目录下的css/style.css
  new ExtractTextPlugin('css/style.css'),
  // 打包前先清空
  new CleanWebpackPlugin('dist'),
  // 热更新
  new webpack.HotModuleReplacementPlugin()
];

config.devServer = {
  contentBase: './example',
  host: 'localhost', // 默认是localhost
  port: 3000, // 端口
  open: true, // 自动打开浏览器
  hot: true, // 开启热更新
  stats: {
    colors: true,
    modules: false
  }
};

module.exports = config;
