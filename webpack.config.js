const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: [
    './client/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    inline: true,
    contentBase: './client',
    port: 8080,
    proxy: { '/api/**': { target: 'http://localhost:3000', secure: false } }
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: {presets: ['es2015','react'], plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread']}},
        {test: /\.jpe?g$|\.gif$|\.svg$|\.png$/i, loader: 'file-loader?name=images/[name].[ext]'},
        {test: /\.css$/, loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader','resolve-url-loader']},
        {test: /\.scss$/, loaders: ['style-loader', 'css-loader','postcss-loader', 'sass-loader','resolve-url-loader']}
        ]
  },
  plugins: [
    // new webpack.DefinePlugin({ // <-- key to reducing React's size
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin(), //minify everything
    // new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // }),
    HTMLWebpackPluginConfig,
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      systemvars: true //
    })]
};
