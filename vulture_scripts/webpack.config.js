const path = require('path');
const webpack = require('webpack');



module.exports = {
    //target: ['node'],
    resolve: {
    //modules: [...],
    fallback: {
        //fs: false,
        "path": require.resolve('path-browserify'),
        "stream": require.resolve('stream-browserify'),
        "crypto": require.resolve('crypto-browserify'),
    } 
  }, 
  mode: 'production',
  //devtool: false,
  entry: {
      vulture_worker: './src/vulture_worker.js',
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '../public'),
  },

  plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
        document: 'kill/me',
      }),
  ],
  experiments: {
    syncWebAssembly: true,
  },
  module: {
    rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.m?js/,
          type: "javascript/auto",
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        { 
          test: /\.ts$/, 
          use: 'ts-loader', exclude: /node_modules/ 
        }
    ],
 }
};