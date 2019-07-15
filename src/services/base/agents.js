import { config, networkUtils } from '../../utils'

const { api } = config
const { base } = api
const { agents } = base

export async function query(params) {
  return networkUtils.request({
    url: agents,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${agents}/${id}`,
    method: 'get',
  })
}

export async function update(payload) {
  return networkUtils.request({
    url: agents,
    method: 'put',
    data: payload,
  })
}

export async function onConfirm(payload) {
  return networkUtils.request({
    url: agents,
    method: 'patch',
    data: payload,
  })
}

export async function remove(ids) {
  return networkUtils.request({
    url: `${agents}/${ids}`,
    method: 'delete',
  })
}

export async function disableEntity(id) {
  return networkUtils.request({
    url: `${agents}/${id}/x`,
    method: 'patch',
  })
}

export async function enableEntity(id) {
  return networkUtils.request({
    url: `${agents}/${id}/o`,
    method: 'patch',
  })
}

export async function exportFile(params) {
  return networkUtils.request({
    url: `${agents}/export`,
    method: 'get',
    data: params,
  })
}
