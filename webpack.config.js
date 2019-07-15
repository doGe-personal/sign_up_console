import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'

module.exports = (webpackConfig, env) => {
  // const production = process.env.NODE_ENV === 'production'
  // webpackConfig.output.path = path.resolve(__dirname, './dist/static/js/');
  webpackConfig.output.chunkFilename = '[name].[chunkhash].js'
  webpackConfig.plugins = webpackConfig.plugins.concat([

    new HtmlWebpackPlugin({
      hash: true,
      mobile: true,
      title: 'SignUp Program',
      inject: false,
      appMountId: 'root',
      lang: 'zh-CN',
      template: `!!ejs-loader!${HtmlWebpackTemplate}`,
      // filename: env === production ? '../dist/index.html' : 'index.html',
      minify: {
        collapseWhitespace: true,      //删除空白符与换行符
        removeComments: true,          //移除HTML中的注释
      },
      scripts: ['/assets/vendors.dll.js'],
      meta: [{
        name: 'description',
        content: '报名后台管理系统',
      }, {
        name: 'author',
        content: 'Lynn',
      }, {
        name: 'keywords',
        content: '企业级, 后台管理系统',
      }, {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      }],
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
  ])

  // Alias
  webpackConfig.resolve.alias = {
    '@components': `${__dirname}/src/components`,
    '@bizComponents': `${__dirname}/src/routes/components`,
    '@utils': `${__dirname}/src/utils`,
    '@config': `${__dirname}/src/utils/config`,
    '@services': `${__dirname}/src/services`,
    '@models': `${__dirname}/src/models`,
    '@routes': `${__dirname}/src/routes`,
    '@themes': `${__dirname}/src/themes`,
    '@public': `${__dirname}/public`,
  }
  return webpackConfig
}
