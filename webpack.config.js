import path from "path";
import ESLintPlugin from "eslint-webpack-plugin";

module.exports = {
  entry: './src/index.ts',
  target: "node",
  externals: [nodeExternals()], 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new ESLintPlugin({ extensions: "ts" })],
};
