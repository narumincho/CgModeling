const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type import('webpack').Configuration */
module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src", "app-last.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules/three/examples/js")
                ],
                use: "imports-loader?THREE=three"
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()]
};
