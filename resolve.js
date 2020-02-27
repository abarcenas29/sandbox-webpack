require('dotenv').config()
const path = require('path')

const env = process.env.NODE_ENV

let alias = {
  Components: path.resolve(__dirname, '..', srcFolder, 'components'),
  Containers: path.resolve(__dirname, '..', srcFolder, 'containers'),
  RootContainers: path.resolve(__dirname, '..', srcFolder, 'rootContainers'),
  Helpers: path.resolve(__dirname, '..', srcFolder, 'helpers')
}

if (env === 'development') {
  alias = {
    'react-dom': '@hot-loader/react-dom',
    ...alias
  }
}


module.exports = {
  alias
}
