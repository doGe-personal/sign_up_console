import { config, networkUtils } from '../../utils'

const { api } = config
const { sys } = api
const { roles, perms } = sys

export async function query(params) {
  return networkUtils.request({
    url: roles,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${roles}/${id}`,
    method: 'get',
  })
}

export async function create(params) {
  return networkUtils.request({
    url: roles,
    method: 'post',
    data: params,
  })
}

export async function update(params) {
  return networkUtils.request({
    url: roles,
    method: 'post',
    data: params,
  })
}

export async function disable(id) {
  return networkUtils.request({
    url: `${roles}/${id}/x`,
    method: 'post',
  })
}

export async function enable(id) {
  return networkUtils.request({
    url: `${roles}/${id}/o`,
    method: 'post',
  })
}

export async function queryPerms(params) {
  return networkUtils.request({
    url: perms,
    method: 'get',
    data: params,
  })
}
