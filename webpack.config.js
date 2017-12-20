const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  const production = env && env.production
  const filename = production ? 'bundle.[hash].js' : 'bundle.js';
  const cssname = production ? 'global.[contenthash].css' : 'global.css';

  return {
    entry: './src/index.js',
    output: {
      filename: filename,
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'federal income taxessssssss',
        template: 'src/index.html.ejs',
      }),
      new ExtractTextPlugin(cssname),
    ],
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
        { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader' }) },
      ]
    }
  };
};
