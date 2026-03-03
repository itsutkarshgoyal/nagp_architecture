const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

/** @type {import('webpack').Configuration} */
module.exports = {
  context: __dirname,
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "auto",
    clean: true
  },
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        policiesApp: "policiesApp@https://mfe-policies.netlify.app/remoteEntry.js",
        paymentsApp: "paymentsApp@https://mfe-payments.netlify.app/remoteEntry.js"
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        "react-dom": { singleton: true, eager: true, requiredVersion: false },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: false }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      inject: "body"
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist")
    },
    port: 3100,
    historyApiFallback: true,
    hot: true,
    open: false,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  }
};

