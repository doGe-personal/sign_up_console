import { config, networkUtils } from '../../utils'

const { api } = config
const { rep } = api
const { actparts } = rep

export async function query(params) {
  return networkUtils.request({
    url: actparts,
    method: 'get',
    data: params,
  })
}


export async function exportFile(params) {
  return networkUtils.request({
    url: `${actparts}/export`,
    method: 'get',
    data: params,
  })
}