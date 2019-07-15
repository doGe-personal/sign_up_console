import { config, networkUtils } from '../../utils'

const { api } = config
const { sys } = api
const { logs } = sys

export async function query(params) {
  return networkUtils.request({
    url: logs,
    method: 'get',
    data: params,
  })
}

export async function getSingle(id) {
  return networkUtils.request({
    url: `${logs}/${id}`,
    method: 'get',
  })
}
