import request from '@/utils/request'

/**
 *查询所有状态
 * @returns
 */
export function getAllStatus() {
  return request.get('/apply/allStatus')
}
