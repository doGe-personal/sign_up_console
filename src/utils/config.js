import hostConf from './host.conf'
import apiConf from './api.conf'

export default {
  name: 'signup',
  prefix: 'signup',
  footerText: 'EL Admin © 2018 Elitescloud.com',
  loginLogo: '/assets/img/login.png',
  logo: '/assets/img/logo.png',
  logoBlack: '/assets/img/logoBlack.png',
  avatar: '/assets/img/logo.png',
  // logo: '/assets/img/logo.png',
  logoSmall: '/assets/img/logo.png',
  iconFontCSS: '/assets/font/iconfont.css',
  iconFontJS: '/assets/font/iconfont.js',
  baseURL: process.env.NODE_ENV === 'development' ? hostConf.devHost : hostConf.prodHost,
  openPages: ['/login'],
  apiPrefix: apiConf.apiPrefix,
  api: apiConf,
}
