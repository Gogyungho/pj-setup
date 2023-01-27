const path = require("path");
const webpack = require("webpack");
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
          publicPath: "./dist/",
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
      `,
    }),
  ],
};
