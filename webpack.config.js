const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebapckPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
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
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
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
        env: isProduction ? "" : "개발용",
      },
      minify: isProduction
        ? {
            collapseWhitespace: true,
            removeComments: true,
          }
        : false,
    }),
    new CleanWebpackPlugin({}),
    ...(isProduction
      ? new MiniCssExtractPlugin({ filename: "[name].css" })
      : []),
  ],
};
