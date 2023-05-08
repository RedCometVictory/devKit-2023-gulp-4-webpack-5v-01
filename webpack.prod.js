const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
let HtmlWebpackPlugin = require("html-webpack-plugin");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: "production",
  target: ['web', 'es5'],
  
  entry: {
    // index: "./resources/assets/js/index.js"    // for adonis
    index: "./src/js/index.js",    // for react/mern
    // app: "./src/js/particles/app.js", 
    // particles: "./src/js/particles/particles.js"
  },
  output: {
    // final build goes into dist
    filename: "[name].[contenthash:8].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "img/[name][contenthash:8][ext]"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true // utilize cache memory of results instead of relying on babel compiling each run
            }
          }
        ],
      },
      // ========================================
      // Comment out section if using gulp to minify files or using static site development
      // ========================================
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      // Webpack compilation of stylings only works if imported through React components. Otherwise compile stylings with gulp by running: npm run build
      {
        // test: /\.(css|scss)$/i,
        // test: /\.scss$/i,
        test: /\.(s[ac]|c)ss$/i,
        // include: [
        // path.resolve(__dirname, "./src/sass")
        // ],
        use: [
          // "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            // MiniCssExtractPlugin.loader,
            // required for asset imports in CSS (ex: url())
            options: {publicPath: "img"}
          }, //3. Extract css into files
          "css-loader", //2. Turns css into commonjs
          "postcss-loader",
          "sass-loader" //1. Turns sass into css
        ]
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/i,
        type: 'asset',
        // type: 'asset/resource',
        // If you want to inline larger images, you can set a custom `maxSize` for inline like so:
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024,
          },
        },
        use: [
          {
            loader: 'webp-loader',
            options: {
              quality: 20
            }
          }
        ]
      }
      // ========================================
      // End of Section
      // ========================================
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash:8].css" }),
    // activate htmlwebpackplugin when using the webpack dev server
    new HtmlWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }),
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     sourceMap: true,
      //     compress: {},
      //     mangle: false,
      //     output: null
      //   }
      // })
      // new CssMinimizerPlugin()
    ],
  }
};