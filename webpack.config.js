const path = require('path');

module.exports = {
  entry: {
    "app-element": './src/app-element.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  /*externals: {
  "@solid/query-ldflex": 'data',
  "lit-element": "LitElement",
  "evejs": "eve",
  "solid-auth-client": "auth",
  "@rdfjs/data-model": "rdfjs"
},*/
devServer: {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 9001,
  historyApiFallback: true,
  inline: true,
  open: true,
  hot: true
},
devtool: "eval-source-map",
performance: { hints: false }
};
