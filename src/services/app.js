import { config, networkUtils } from '../utils'

const { api } = config

export async function getCaptcha() {
  return networkUtils.request({
    url: api.basic.captcha,
    method: 'get',
  })
}

export async function login(data) {
  return networkUtils.request({
    url: api.basic.userLogin,
    method: 'form',
    data,
  })
}

export async function logout(data) {
  return networkUtils.request({
    url: api.basic.userLogout,
    method: 'post',
    data,
  })
}

export async function getPrincipal() {
  return networkUtils.request({
    url: api.basic.principal,
    method: 'get',
  })
}

export async function queryMenu() {
  return networkUtils.request({
    url: api.app.menus,
    method: 'get',
  })
}
