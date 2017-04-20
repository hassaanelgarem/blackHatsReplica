const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'app': './assets/app/main.ts'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        rules: [{
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'raw-loader'
                }]
            }
        ],
        exprContextCritical: false

    }
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './views/index.hbs'
    //     })
    // ]
};
