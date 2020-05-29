import request from '@/utils/request'


/**
 * 获取用户的家庭情况变化记录
 *
 * @export
 * @param {*} id
 * @returns
 */
export function socialModefyRecord(id) {
  return request.get('/users/socialModefyRecord', {
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
export function singleModefyRecord(code) {
  return request.get('/users/singleSocialModefyRecord', {
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
export function singleModefyRecord(record, auth) {
  return request.post('/users/singleSocialModefyRecord', {
    record,
    auth
  })
}
