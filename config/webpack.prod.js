const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
//const path = require('path');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

console.log("@@@@@@@@ PRODUCTION ENVIRONMENT STARTED @@@@@@@@");

module.exports = webpackMerge(commonConfig, {
  mode: 'production',
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/app/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  
  optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,                
            },
            ecma: 6,
            mangle: {
              keep_fnames: true
            },
            output: {
              comments: false,
              ascii_only: true,
              beautify: false
            }
          },
          sourceMap: true
        })
      ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    
    new ExtractTextPlugin('[name].[hash].css'),

    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),

    new HtmlWebpackPlugin({
        template: 'src/index-prod.html'
    }),

    new webpack.LoaderOptionsPlugin({
      test: /\.html$/,
      options: {
        htmlLoader: {
          minimize: false,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
          ],
          customAttrAssign: [/\)?\]?=/]
        }
      }
    })
  ]
});