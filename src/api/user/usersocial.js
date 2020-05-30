import request from '@/utils/request'

/**
 * 获取用户的家庭情况变化记录
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getUserSocialRecord(id) {
  return request.get('/users/social/userModefyRecord', {
    params: {
      id
    }
  })
}

/**
 * 获取单条记录
 *
 * @export
 * @param {*} code
 * @returns
 */
export function getSingle(code) {
  return request.get('/users/social/modefyRecord', {
    params: {
      code
    }
  })
}
/**
 * 修改单条记录
 *
 * @export
 * @param {SocialModefyRecord} record
 * @param {GoogleAuth} auth
 * @returns
 */
export function modefySingle(record, auth) {
  return request.post('/users/social/modefyRecord', {
    record,
    auth
  })
}

/**
 * 修改用户家庭情况
 *
 * @export
 * @param {*} id
 * @param {*} settle
 * @param {*} auth
 */
export function modefySettle(id, settle, auth) {
  return request.post('/users/social/settle', {
    auth,
    data: {
      id,
      settle
    }
  })
}
