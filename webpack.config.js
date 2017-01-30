const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');

const srcDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'static', 'js');
module.exports = {
    // devtool: 'source-map',
    resolve: {
        root: [srcDir]
    },
    entry: {
        minimalism: 'js/index'
    },
    output: {
        path: destDir,
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            loader: 'style!css!postcss'
        }, {
            test: /\.(scss|sass)$/,
            loader: 'style!css!postcss!sass'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ],
    postcss: function() {
        return [
            autoprefixer()
        ];
    }
};
