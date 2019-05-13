var webpack = require("webpack");

module.exports = {
  entry: "./app/scripts.babel/events-modular",
  // debug: true,
  output: {
    filename: "events.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env"],
          // ref: https://github.com/babel/babel-loader/issues/132
          // presets: ['react', 'es2015'],
          compact: false
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
