module.exports = {
  entry: "./src/App.jsx",
  output: {
    path: __dirname + "./static",
    filename: "app.bundle.js"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        query: {
          presets: ["react"]
        }
      }
    ]
  }
};
