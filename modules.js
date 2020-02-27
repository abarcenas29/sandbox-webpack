require('dotenv').config()

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const NODE_ENV = process.env.NODE_ENV

const postCssPlugins = [
  require('tailwindcss'),
  require('autoprefixer')
]

if (NODE_ENV === 'production') {
  postCssPlugins.push(
    require('cssnano')()
  )
}

module.exports = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        { loader: NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader },
        { loader: 'css-loader' },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => postCssPlugins
          }
        },
        { loader: 'sass-loader' }
      ]
    },
    {
      test: /\.(ttf|eot|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      }
    },
    {
      test: /\.(jpe?g|png|gif|svg|ico)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/'
          }
        }
      ]
    }
  ]
}
