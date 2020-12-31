const path = require('path');
const { DefinePlugin } = require('webpack');

const CssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js',
  },
  devtool: IS_DEV ? 'source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
    open: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      }, {
        test: /\.css$/i,
        use: [IS_DEV ? 'style-loader' : CssExtractPlugin.loader, 'css-loader'],
      }, {
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader'],
      }
    ],
  },
  plugins: [
    ...(IS_DEV ? [] : [new CssExtractPlugin({ filename: 'style.css' })]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: false,
    }),
    new DefinePlugin({
      "process.env": { "NODE_ENV": JSON.stringify(process.env.NODE_ENV) },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimization: {
    minimize: !IS_DEV,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: { output: { comments: false } },
        extractComments: false,
      }),
    ],
  },
};
