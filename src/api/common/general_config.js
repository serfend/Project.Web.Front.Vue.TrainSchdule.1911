import request from '@/utils/request'
const api = 'CommonDictionary/'
export function allConfig ({ pageIndex = 0, pageSize = 20, search }) {
  return request.get(`${api}allConfig`, {
    params: { pageIndex, pageSize, search }
  })
}

export function getConfig ({ name }) {
  return request.get(`${api}config`, { params: { name }})
}
export function getConfigs({ names }) {
  return request.get(`${api}config`, { params: { names }})
}

/**
 * 编辑配置
 *
 * @export
 * @param {*} {
 * data object {name,description,data,isremove,data,companyregion,enable},
 * auth
 * }
 * @return {*}
 */
export function postConfig ({ data, auth }) {
  return request.post(`${api}config`, {
    auth,
    model: data
  })
}
