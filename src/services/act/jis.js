import { config, networkUtils } from '../../utils'

const { api } = config
const { act } = api
const { jis, jids } = act

export async function query(params) {
  return networkUtils.request({
    url: jis,
    method: 'get',
    data: params,
  })
}

export async function getDetails(jiId) {
  return networkUtils.request({
    url: `${jids}/jiId/${jiId}`,
    method: 'get',
  })
}

export async function exchangeStatus(params) {
  return networkUtils.request({
    url: `${jis}/exchangeStatus`,
    method: 'patch',
    data: params,
  })
}
export async function patchExamine(params) {
  return networkUtils.request({
    url: `${jis}/patchExamine`,
    method: 'patch',
    data: params,
  })
}