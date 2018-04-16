var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    target: "web",
    entry: ["whatwg-fetch","./ui/src/index.jsx"],
    output: {
        path: __dirname + "/build",
        filename: "rapido-web.js",
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: "http://localhost:8090/"
    },
    plugins: [new HtmlWebpackPlugin({
        template: "ui/index.html"
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    })
    ],
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader?presets[]=es2015&presets[]=react"
            },
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader?presets[]=es2015"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: "url-loader?limit=10000",
            },
            {
                test: /\.(eot|ttf)$/,
                loader: "file-loader",
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve("./src"),
            path.resolve("./node_modules")
        ],
        extensions: [".js", ".jsx"]
    },
    devServer: {
        watchOptions: {
        // Needed for Windows Subsystem for Linux dev environment:
            poll: true
        }
    },
    devtool: "cheap-eval-source-map",
    node: {
        child_process : "empty",
        fs: "empty"
    }
};
