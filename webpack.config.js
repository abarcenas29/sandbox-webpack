require('dotenv').config()

const path = require('path')

const plugins = require('./plugins.js')
const resolve = require('./resolve.js')
const webpackModule = require('./modules.js')

const devServer = {
  historyApiFallback: true,
  host: '0.0.0.0',
  port: process.env.PORT,
  publicPath: '/',
  writeToDisk: true
}

module.exports = (env, options) => {
  const isDevMode = (process.env.NODE_ENV === 'development')
  const srcFolder = process.env.SRC_FOLDER
  const webpackEntryPath = process.env.WEBPACK_ENTRY_PATH
  const webpackBuildPath = process.env.WEBPACK_BUILD_PATH

  const config = {
    entry: {
      styles: path.resolve(__dirname, '..', srcFolder, 'styles.js'),
      main: path.resolve(
        __dirname,
        '..',
        srcFolder,
        webpackEntryPath
      )
    },
    target: 'web',
    output: {
      path: path.join(__dirname, '..', webpackBuildPath),
      filename: '[name].bundle.js',
      chunkFilename: 'bundle.[chunkhash].js',
      publicPath: '/'
    },
    devtool: (isDevMode) ? 'inline-source-map' : 'source-map',
    resolve,
    plugins,
    devServer,
    module: webpackModule
  }

  return config
}
