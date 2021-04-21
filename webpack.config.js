module.exports = {
    entry: './dist',
    output: {
        path: `${__dirname}/dist`,
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        fallback: {
            fs: false,
            tls: false,
            net: false,
            path: false,
            zlib: false,
            http: false,
            https: false,
            stream: false,
            crypto: false,
            'path-browserify': require.resolve('path-browserify'),
        },
    },
};
