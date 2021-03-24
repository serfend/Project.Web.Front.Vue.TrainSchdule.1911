import request from '@/utils/request'
const api = '/applyAudit'

/**
 * 操作申请
 * @param {String} action 操作类型 required
 * @param {String} id 申请的id required
 */
export function doAction(action, id) {
  return request.put(`${api}/${action}?id=${id}`)
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
  return request.post(`${api}/audit`, {
    data,
    auth
  })
}
/**
 * 获取指定用户的审批流
 *
 * @export
 * @param {*} id
 * @returns
 */
export function auditStream(id) {
  return request.get(`${api}/auditStream`, {
    params: {
      id
    }
  })
}
