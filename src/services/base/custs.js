import { config, networkUtils } from '../../utils'

const { api } = config
const { base, ei } = api
const { custs, addrqs } = base
const { qualifyDownLoad, uploadSingle } = ei

export async function query(params) {
  return networkUtils.request({
    url: custs,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${custs}/${id}`,
    method: 'get',
  })
}

export async function update(payload) {
  return networkUtils.request({
    url: `${custs}`,
    method: 'put',
    data: payload,
  })
}

export async function remove(ids) {
  return networkUtils.request({
    url: `${custs}/${ids}`,
    method: 'delete',
  })
}

export async function exchangStatus(payload) {
  return networkUtils.request({
    url: `${custs}`,
    method: 'patch',
    data: payload,
  })
}

export async function exportFile(params) {
  return networkUtils.request({
    url: `${custs}/export`,
    method: 'get',
    data: params,
  })
}

export async function fetchQualifyImg(filePath) {
  return networkUtils.request({
    url: `${qualifyDownLoad}/${filePath}`,
    method: 'get',
  })
}

export async function fetchQualify(id) {
  return networkUtils.request({
    url: `${addrqs}/${id}`,
    method: 'get',
  })
}

export async function uploadQualify(payload) {
  return networkUtils.request({
    url: uploadSingle.replace('{repoId}', 'admin'),
    method: 'upload',
    data: payload,
  })
}

export async function qualifyUpdate(payload) {
  return networkUtils.request({
    url: `${addrqs}`,
    method: 'patch',
    data: payload,
  })
}
