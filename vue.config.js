var webpack = require("webpack");

module.exports = {
    configureWebpack: {
        devtool: 'cheap-module-source-map',
        resolve: {
            fallback: {
                "stream": require.resolve("./node_modules/stream-browserify"),
                "crypto": require.resolve("./node_modules/crypto-browserify"),
                "path": require.resolve("./node_modules/path-browserify"),
                "os": require.resolve("./node_modules/os-browserify"),
                "buffer": require.resolve("buffer"),
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
            }),
        ]
    },

    pages: {
        'index': {
            entry: './src/main.ts',
            template: 'public/index.html',
            title: 'Vulture',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        'webApp': {
            entry: './src/webAppEntry.ts',
            template: 'public/webApp.html',
            title: 'Vulture WebApp',
            chunks: ['chunk-vendors', 'chunk-common', 'webApp'],
        },
    },
}
