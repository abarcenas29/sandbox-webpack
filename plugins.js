require('dotenv').config()

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const glob = require('glob')

const srcFolder = process.env.SRC_FOLDER
const ENV = process.env.NODE_ENV

const plugin = [
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin([
    './app/site.webmanifest',
    './app/manifest.json',
    {
      from: './app/assets',
      to: 'assets'
    }
  ]),
  new HtmlWebpackPlugin({
    template: path.resolve(srcFolder, 'index.html')
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css'
  })
]

if (ENV === 'production') {
  plugin.push(
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './app/sw-src.js',
      swDest: 'sw.js'
    })
  )

  plugin.push(
    new PurgecssPlugin({
      paths: glob.sync(
        path.resolve(
          __dirname, '..', srcFolder, '**', '*'
        ), { nodir: true }
      ),
      // Include any special characters you're using in this regular expression
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      only: ['main']
    })
  )

  plugin.push(
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    })
  )
}

module.exports = plugin
