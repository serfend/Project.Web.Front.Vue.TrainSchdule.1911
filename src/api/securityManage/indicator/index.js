import { parseTime } from '@/utils'
import request from '@/utils/request'
const api = 'securityData'
export function all_indicators () {
  return request.get(`${api}/AllIndicators`, {
    params: {
    }
  })
}
/**
 * 获取指标状态
 *
 * @export
 * @param {*} {
 * name string
 * start DateTime
 * end DateTime
 * }
 * @return {*}
 */
export function get_indicator ({ name, start, end }) {
  const d = new Date()
  start = parseTime(start || d, '{y}-{m}-{d}')
  d.setDate(d.getDate() + 1)
  end = parseTime(end || d, '{y}-{m}-{d}')
  return request.get(`${api}/IndicatorFetch/${name}`, {
    params: {
      start, end
    }
  })
}

export default {
  get_indicator,
  all_indicators
}
