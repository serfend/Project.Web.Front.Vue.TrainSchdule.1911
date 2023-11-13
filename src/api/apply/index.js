import request from '@/utils/request'

/**
 *查询所有状态
 * @returns
 */
export function getAllStatus() {
  return request.get('/apply/allStatus')
}

/**
 * 获取请假类型
 *
 * @export
 * @return {*}
 */
export function getRequestTypes() {
  return request.get('apply/applyRequestTypes')
}

/**
 * 获取指定假期类型的福利假
 *
 * @export
 * @param {*} vacationType
 * @return {*}
 */
export function benefitList (vacationType) {
  return request.get('apply/welfareVacations', {
    params: { vacationType }
  })
}
