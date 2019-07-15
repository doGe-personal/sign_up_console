import { config, networkUtils } from '../../utils'

const { api } = config
const { base } = api
const { prts } = base

export async function query(params) {
  return networkUtils.request({
    url: prts,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${prts}/${id}`,
    method: 'get',
  })
}

export async function update(payload) {
  return networkUtils.request({
    url: `${prts}`,
    method: 'put',
    data: payload,
  })
}

export async function remove(ids) {
  return networkUtils.request({
    url: `${prts}/${ids}`,
    method: 'delete',
  })
}

