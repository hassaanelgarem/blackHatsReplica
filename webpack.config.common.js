const webpack = require('webpack');

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
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loader: 'raw-loader'
            },
            /*
             * File loader for supporting images, for example, in CSS files.
             */
            {
                test: /\.(jpg|png|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.scss$/,
                loader: 'raw-loader!postcss-loader!sass-loader'
            }
        ],
        exprContextCritical: false
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ]
};
