import request from '@/utils/request'

/**
 *  删除申请
 * @param {json} params
 *      {string} params.id
 *      {Auth}   params.Auth
 */
export function deleteApply(params) {
  return request({
    url: '/apply/Submit',
    method: 'delete',
    data: params
  })
}
