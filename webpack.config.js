const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebapckPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  bail: true, // 에러 발생시 build 중단
  entry: "./src/index.js", // webpack이 처음 시작되는 부분
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    // entry point를 기준으로 모든 .js파일을 합쳐서 하나의 bundle 파일로 만든다.
    // 이걸 어디에 저장할지 지정하는 option이다.
    filename: "app.js",
    path: path.resolve(__dirname, "./dist"),
  },
  devServer: {
    static: path.resolve(__dirname, "./dist"),
    port: 9001,
    hot: true,
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  optimization: {
    minimizer: isProduction
      ? [
          new CssMinimizerPlugin(),
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // 콘솔 로그를 제거한다
              },
            },
          }),
        ]
      : [],
  },
  module: {
    // test에 설정한 파일들을 검사하고, 조건에 맞는 파일들에 대해 loader들을 실행하고 해석한다.
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          "css-hot-loader",
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg|swf|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]?[hash]",
          limit: 20000, // 2kb
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // 개발할때 API 서버주소, 배포했을때 API 서버 주소를 설정하는 Plugin
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
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })]
      : []),
    new ESLintPlugin({
      extensions: ["js", "ts"],
      emitError: true,
      emitWarning: true,
      failOnError: true,
      failOnWarning: true,
      useEslintrc: true,
      cache: true,
    }),
  ],
};
