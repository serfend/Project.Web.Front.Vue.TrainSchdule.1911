import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} data
 * @returns
 */
export function postRecallOrder(data) {
  return request.post('/apply/recallorder', data)
}
/**
 * 获取召回信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getRecallOrder(id) {
  return request.get('/apply/recallorder', {
    params: {
      id
    }
  })
}
