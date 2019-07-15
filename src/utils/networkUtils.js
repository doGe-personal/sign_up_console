import { message, Modal } from 'antd'
import axios from 'axios'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'
import { clone } from 'ramda'
import config from './config'
import enums from './enums'
import logger from './logger'

import { dataUtils } from './index'

/*
 * Network utility functions
 *
 */

const { api, baseURL } = config
const { basic } = api
// const { enums } = utils;
const { resultCode } = enums

// anti-CSRF
const RESULT_CODE = 'el-result-code' // WebUtil#RESULT_CODE
let _csrfHeaders
const csrf = (() => axios.get(basic.csrf)
  .then((res) => {
    const csrfToken = res.headers[RESULT_CODE]
    localStorage.setItem('csrfToken', csrfToken)
    _csrfHeaders = (headers) => (
      { ...headers, 'el-xsrf': localStorage.getItem('csrfToken') }) // WebUtil#XSRF_NAME
    logger.info('[CSRF] token:', csrfToken)
    return csrfToken
  }))

// .catch((error) => {
//   const msg = '服务器连接失败'
//   logger.error(`[ERROR] ${msg}`)
//   return { success: false, status: 600, message: msg }
// })

const csrfHeaders = (headers) => _csrfHeaders && _csrfHeaders(headers)

// Helpers
const errorDecoder = (code) => code && resultCode[code]
const serializeDate = (d) => dataUtils.ymd(d)
const paramsSerializer = (params) => qs.stringify(params, { serializeDate, indices: false })

// Default config of axios
logger.info(`API Server: ${baseURL}`)
axios.defaults = Object.assign(axios.defaults, {
  baseURL,
  timeout: 15000,
  withCredentials: true,
})

axios.interceptors.request.use(
  (config) => {
    // console.log(config.method);
    // if (config.method === 'post') {
    //   config.data = {
    //     ...config.data,
    //     _t: Date.parse(new Date()) / 1000,
    //   };
    // } else
    if (config.method === 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params,
      }
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use((response) => {
  // token 已过期，重定向到登录页面
  // console.log(response.status);
  if (response.status === 401) {
    // Modal.error({
    //   title: '登录超时',
    //   content: '请重新登陆',
    //   okText: '好',
    //   onOk: () => {
    //     window.location.href = '/login';
    //   },
    // });
    return response
  }

  if (response.status === 404) {
    message.error('请求失败，请联系管理员')
    return response
  }

  return response
}, (error) => {
  // Do something with response error
  return Promise.reject(error)
})

const fetch = (options) => {
  let { method = 'GET', data, url } = options

  const cloneData = clone(data)

  // console.log(options);
  try {
    let domain = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domain = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domain.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    console.log(e)
    message.error(e.message)
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        headers: csrfHeaders(),
        paramsSerializer,
      })
    case 'post':
      return axios.post(url, cloneData, {
        headers: csrfHeaders(),
      })
    case 'form':
      return axios.post(url, {}, {
        params: cloneData,
        headers: csrfHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        paramsSerializer,
      })
    case 'delete':
      return axios.delete(url, {
        headers: csrfHeaders(),
        data: cloneData,
      })
    case 'put':
      return axios.put(url, cloneData, {
        headers: csrfHeaders(),
      })
    case 'patch':
      return axios.patch(url, cloneData, {
        headers: csrfHeaders(),
      })
    case 'upload':
      return axios.post(url, data, {
        headers: csrfHeaders({
          'Content-Type': 'multipart/form-data',
          // 'X-Requested-With': 'XMLHttpRequest',
        }),
      })
    default:
      return axios(options)
  }
}

const request = (options) => {
  logger.network(`[REQUEST] [${options.method.toUpperCase()}] ${options.url}`, options)

  return fetch(options).then((response) => {
    logger.network(`[RESPONSE] [${options.method.toUpperCase()}] ${options.url}`, response)
    // console.groupEnd()
    const { headers, status } = response
    const data = response.data
    if (headers[RESULT_CODE] && headers[RESULT_CODE] !== 'OK') {
      return {
        success: false,
        message: errorDecoder(headers[RESULT_CODE]),
        status,
        data,
      }
    }

    return {
      success: true,
      message: errorDecoder(headers[RESULT_CODE]),
      status,
      data,
      headers,
    }
  }).catch((error) => {
    let msg = ''
    const { response } = error

    // console.log(response);

    if (response) {
      const { headers, status } = response
      logger.error(`[RESPONSE] [${options.method.toUpperCase()}] ${options.url}`, response)

      if (status === 401) {
        Modal.error({
          title: '登录超时',
          content: '请重新登录',
          okText: '好',
          onOk: () => {
            window.location.href = '/#/login'
          },
        })

        msg = '登录超时'
        // return;
      } else if (status === 400) {
        msg = '错误的请求参数'
      } else if (status === 404) {
        msg = '请求的API不存在'
      } else if (status === 409) {
        msg = '主键冲突'
      } else if (status === 500) {
        msg = '服务端错误'
      }
      // const otherData = data;
      msg = msg || headers[RESULT_CODE]
      // console.log(msg);
      return { success: false, status, message: msg }
    }

    const status = 600
    msg = '网络异常'
    return { success: false, status, message: msg }
  })
}

export default { request, csrf }
