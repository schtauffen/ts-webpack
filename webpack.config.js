const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

const config = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },
  devServer: {
    contentBase: [path.resolve(__dirname)],
    publicPath: "/dist"
  },
  mode: devMode ? "development" : "production",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  plugins: [
    new MiniCssExtractPlugin({
      fileName: devMode ? "[name].css" : "[name].[hash].css",
      chunkFileName: devMode ? "[id].css" : "[id].[hash].css"
    })
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // }
};

if (!devMode) {
  config.optimizations = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  };
}

module.exports = config;
