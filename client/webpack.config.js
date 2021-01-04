
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        './src/app.js'
    ],
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'app.bundle.js',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(stardust))/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    plugins: [
                        'transform-runtime',
                        'add-module-exports',
                        'transform-decorators-legacy',
                    ],
                    presets: ['es2015', 'react', "stage-1"],
                },
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
    ]
};
