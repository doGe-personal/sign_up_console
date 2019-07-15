export default {
  entry: 'src/index.js',
  theme: './theme.config.js',
  publicPath: '/',
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'none',
  ignoreMomentLocale: true,
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM',
  //   'antd': 'antd',
  //   'bizChart': 'bizChart',
  //   'lodash': 'lodash',
  // },
  extraBabelPlugins: [
    '@babel/transform-runtime',
    'transform-decorators-legacy',
    ['import',
      {
        'libraryName': 'antd', 'libraryDirectory': 'es', 'style': true,
      }
    ],
  ],
  env: {
    development: {
      'extraBabelPlugins': [
        'dva-hmr',
      ]
    },
  },
  proxy: {
    '/svr': {
      target: 'https://cpwxa.chinacloudsites.cn',
      // target: 'http://192.168.2.228:9001',
      secure: false,
      changeOrigin: true,
    }
  }
}
