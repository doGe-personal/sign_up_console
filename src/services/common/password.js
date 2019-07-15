import { config, networkUtils } from '../../utils'

const { request } = networkUtils
const { api } = config
const { basic } = api

export async function changePW(data) { // empCode
  return request({
    url: basic.changePW,
    method: 'form',
    data,
  })
}

export async function resetPW(data) {
  return request({
    url: basic.resetPW,
    method: 'form',
    data,
  })
}
