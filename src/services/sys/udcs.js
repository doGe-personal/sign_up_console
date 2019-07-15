import { config, networkUtils } from '../../utils'

const { api } = config
const { sys } = api
const { udcs, udcItems, udcsClear } = sys

export async function query(params) {
  return networkUtils.request({
    url: udcs,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${udcs}/${id}`,
    method: 'get',
  })
}

export async function clearCache(params) {
  return networkUtils.request({
    url: udcsClear,
    method: 'post',
    data: params,
  })
}

export async function update(params) {
  return networkUtils.request({
    url: `${udcs}/update`,
    method: 'post',
    data: params,
  })
}

export async function queryItems(id) {
  return networkUtils.request({
    url: udcItems.replace('{id}', id),
    method: 'get',
  })
}
