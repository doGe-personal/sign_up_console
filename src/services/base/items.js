import { config, networkUtils } from '../../utils'

const { api } = config
const { base } = api
const { items } = base

export async function query(params) {
  return networkUtils.request({
    url: items,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${items}/${id}`,
    method: 'get',
  })
}

export async function update(payload) {
  return networkUtils.request({
    url: `${items}`,
    method: 'put',
    data: payload,
  })
}

export async function remove(ids) {
  return networkUtils.request({
    url: `${items}/${ids}`,
    method: 'delete',
  })
}

export async function exportFile(params) {
  return networkUtils.request({
    url: `${items}/export`,
    method: 'get',
    data: params,
  })
}

export async function getItemByCode(params) {
  return networkUtils.request({
    url: `${items}/byCode/${params}`,
    method: 'get',
  })
}
