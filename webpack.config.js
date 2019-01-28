const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      pace: 'pace-progress'
    }
  },
  entry: {
    minimalism: 'js/index'
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: path.join('js', '[name].js')
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        'babel-loader',
      ]
    }, {
      test: /\.scss$/,
      use: [{
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('autoprefixer')
              ];
            }
          }
        },
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join('css', 'minimalism.css')
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
};
