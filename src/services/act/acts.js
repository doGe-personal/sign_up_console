import { config, networkUtils } from '../../utils'

const { api } = config
const { act, ei } = api
const { acts, actdets, ais, ars, als } = act
const { uploadSingle } = ei

export async function query(params) {
  return networkUtils.request({
    url: acts,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${acts}/${id}`,
    method: 'get',
  })
}

export async function update(payload) {
  return networkUtils.request({
    url: acts,
    method: 'put',
    data: payload,
  })
}

export async function onConfirm(payload) {
  return networkUtils.request({
    url: acts,
    method: 'patch',
    data: payload,
  })
}

export async function remove(ids) {
  return networkUtils.request({
    url: `${acts}/${ids}`,
    method: 'delete',
  })
}

export async function disableEntity(id) {
  return networkUtils.request({
    url: `${acts}/${id}/x`,
    method: 'patch',
  })
}

export async function enableEntity(id) {
  return networkUtils.request({
    url: `${acts}/${id}/o`,
    method: 'patch',
  })
}

export async function uploadImg(payload) {
  return networkUtils.request({
    url: uploadSingle.replace('{repoId}', 'active'),
    method: 'upload',
    data: payload,
  })
}

export async function queryItems(actId) {
  return networkUtils.request({
    url: `${actdets}/${actId}`,
    method: 'get',
  })
}

export async function queryByActId(actId) {
  return networkUtils.request({
    url: `${ais}/actId/${actId}`,
    method: 'get',
  })
}

export async function queryRules(actId) {
  return networkUtils.request({
    url: `${ars}/actId/${actId}`,
    method: 'get',
  })
}

export async function queryLimits(actId) {
  return networkUtils.request({
    url: `${als}/actId/${actId}`,
    method: 'get',
  })
}

export async function exportFile(actId) {
  return networkUtils.request({
    url: `${als}/export/${actId}`,
    method: 'get',
  })
}

export async function patchImport(formData) {
  return networkUtils.request({
    url: `${als}/import`,
    data: formData,
    method: 'upload',
  })
}
