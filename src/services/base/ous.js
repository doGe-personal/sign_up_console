import { config, networkUtils } from '../../utils'

const { api } = config
const { base } = api
const { ous } = base

export async function query(params) {
  return networkUtils.request({
    url: ous,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${ous}/${id}`,
    method: 'get',
  })
}

export async function update(params) {
  return networkUtils.request({
    url: ous,
    method: 'put',
    data: params,
  })
}

export async function remove(ids) {
  return networkUtils.request({
    url: `${ous}/${ids}`,
    method: 'delete',
  })
}

export async function refreshPass(id) {
  return networkUtils.request({
    url: `${ous}/${id}/p`,
    method: 'patch',
  })
}

export async function exportFile(params) {
  return networkUtils.request({
    url: `${ous}/export`,
    method: 'get',
    data: params,
  })
} 

