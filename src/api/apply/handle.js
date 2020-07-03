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

/**
 * 操作申请
 * @param {String} action 操作类型 required
 * @param {String} id 申请的id required
 */
export function doAction(action, id) {
  return request.put(`/apply/${action}?id=${id}`)
}

/**
 *批量审批
 *
 * @export
 * @param {Arr[json]} data
 *      data:{
 *        List:{
 *          id:
 *          action:
 *          remark:
 *        },
 *        ...
 *      }
 * @param {Auth} Auth
 * @returns
 */
export function audit(data, auth) {
  return request.post('/apply/audit', {
    data,
    auth
  })
}
