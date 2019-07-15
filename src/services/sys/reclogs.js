import { config, networkUtils } from '../../utils'

const { api } = config
const { sys } = api
const { reclogs } = sys

export async function query(params) {
  return networkUtils.request({
    url: reclogs,
    method: 'get',
    data: params,
  })
}
  