const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = {
    entry: './src/app.js',
    output: {
      filename: 'bundle.js',
    },
    mode: 'development',
    plugins: [
        new NodePolyfillPlugin()
    ]
}