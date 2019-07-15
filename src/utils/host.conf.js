/**
 * 开发环境后端配置
 */
const PROTOCOL = 'http'
const PREFIX = 'signup'
/* 后端服务器地址IP */
const IP = 'localhost'
/* 后端服务器端口 */
const PORT = '9000'
const devHost = `${PROTOCOL}://${IP}:${PORT}/${PREFIX}`

/**
 * 生产环境后端配置
 */
const PROD_PROTOCOL = 'http'
const PROD_IP = 'localhost'
const PROD_PORT = '9000'
const PROD_PREFIX = 'signup'

const prodHost = `${PROD_PROTOCOL}://${PROD_IP}:${PROD_PORT}/${PROD_PREFIX}`

export default {
  devHost,
  prodHost,
}
