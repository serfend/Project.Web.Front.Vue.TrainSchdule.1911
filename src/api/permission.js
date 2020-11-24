import request from '@/utils/request'

/**
 * 获取权限
 * @param {{
  * id: String,
  * Auth: {
  *   Code: String,
  *   AuthByUserID: String
  * },
  * }} params
  */
export function getPermission(params) {
  return request.get('account/Permission', {
    params
  })
}

/**
 * 获取权限列表
 *
 * @export
 * @returns
 */
export function allPermissions() {
  return request.get('account/permissionDictionary')
}

/**
 * 新增权限
 * @param
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String,
 * },
 * newPermission: String
 *
 */
export function postPermission(params) {
  return request.post('account/Permission', params)
}
