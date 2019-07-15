const webpack = require('webpack')
const path = require('path')
const library = '[name]_lib'

const vendors = [
  'react',
  'react-dom',
  'dva',
  'dva/router',
  'dva/saga',
  'dva/fetch',
  'antd/es',
  'redux',
  'redux-saga',
]

module.exports = {
  output: {
    path: path.resolve(__dirname, 'public', 'assets'),
    filename: '[name].dll.js',
    library: library,
  },
  entry: {
    vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      // This must match the output.library option above
      name: library,
      context: __dirname,
    }),
  ],
}
