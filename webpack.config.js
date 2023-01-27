const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebapckPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]?[hash]",
          limit: 20000, // 2kb
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleDateString()}
        Commit Version ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    new webpack.DefinePlugin({}),
    new HtmlWebapckPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "개발용" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
  ],
};
