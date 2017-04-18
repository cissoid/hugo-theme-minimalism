const path = require('path');
const webpack = require('webpack');

module.exports = {
    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ]
    },
    entry: {
        minimalism: 'js/index'
    },
    output: {
        path: path.join(__dirname, 'static', 'js'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                'babel-loader?cacheDirectory',
            ]
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false
        }),
        // new webpack.optimize.AggressiveMergingPlugin()
    ],
    node: {
        Buffer: false
    }
};
