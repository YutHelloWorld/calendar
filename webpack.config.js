const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const __DEV__ = process.env.NODE_ENV === 'development';
let config = {
  mode: __DEV__ ? 'development' : 'production',
  entry: './example/src/index', // 入口文件
  output: {
    filename: 'bundle.[hash:4].js', // 添加hash可以防止文件缓存，每次都会生成4位的hash串
    path: path.resolve('dist'), // 打包后的目录，必须是绝对路径
    publicPath: __DEV__ ? '/' : '/calendar/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
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
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'sass-loader'
        ]
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
    hash: true, // 会在打包好的bundle.js 后面加上 hash串
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    },
    chunksSortMode: 'dependency'
  }),
  // // 拆分后会把 css 文件放到 dist 目录下的css/style.css
  new ExtractTextPlugin('css/style-[hash:4].css'),
  // 打包前先清空
  new CleanWebpackPlugin('dist'),
  // 热更新
  new webpack.HotModuleReplacementPlugin(),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'public'),
      to: path.resolve(__dirname, 'dist')
    }
  ])
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
