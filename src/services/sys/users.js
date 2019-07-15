import { config, networkUtils } from '../../utils'

const { api } = config
const { sys } = api
const { users, resetPW } = sys

export async function query(params) {
  return networkUtils.request({
    url: users,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${users}/${id}`,
    method: 'get',
  })
}

export async function create(params) {
  return networkUtils.request({
    url: users,
    method: 'post',
    data: params,
  })
}

export async function update(params) {
  return networkUtils.request({
    url: users,
    method: 'post',
    data: params,
  })
}

export async function disable(id) {
  return networkUtils.request({
    url: `${users}/${id}/x`,
    method: 'post',
  })
}

export async function enable(id) {
  return networkUtils.request({
    url: `${users}/${id}/o`,
    method: 'post',
  })
}

export async function reSetPW(userId) {
  return networkUtils.request({
    url: `${resetPW}/${userId}`,
    method: 'post',
  })
}
