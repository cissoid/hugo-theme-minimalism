const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractCSS = new ExtractTextPlugin(path.join('css', 'minimalism.bundle.css'));

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
        path: path.join(__dirname, 'static'),
        filename: path.join('js', '[name].bundle.js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                'babel-loader?cacheDirectory',
            ]
        }, {
            test: /\.scss$/,
            use: extractCSS.extract({
                fallback: 'style-loader',
                use: [
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
            })
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
        new webpack.optimize.ModuleConcatenationPlugin(),
        extractCSS
    ],
    node: {
        Buffer: false
    }
};
