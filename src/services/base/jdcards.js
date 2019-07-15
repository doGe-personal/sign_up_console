import { config, networkUtils } from '../../utils'

const { api } = config
const { base, ei } = api
const { jdcards } = base
const { download } = ei

export async function query(prtId) {
  return networkUtils.request({
    url: `${jdcards}/${prtId}/p`,
    method: 'get',
  })
}

export async function downloadTmpl() {
  return networkUtils.request({
    url: download.replace('{repoId}', 'template').replace('{file}', 'jdcards-template.xlsx'),
    method: 'get',
  })
}

export async function patchImport(formData) {
  return networkUtils.request({
    url: `${jdcards}/import`,
    data: formData,
    method: 'upload',
  })
}
