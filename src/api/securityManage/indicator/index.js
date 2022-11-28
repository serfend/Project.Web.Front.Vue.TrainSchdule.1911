import { parseTime } from '@/utils'
import request from '@/utils/request'
const indicators = [
  { name: '指标1', description: '描述内容', value: 32, range: [10, 60] },
  { name: '指标2', description: '描述内容', value: 14, range: [5, 20] },
  { name: '指标3', description: '描述内容', value: 75, range: [5, 8] },
  { name: '周请假次数', description: '描述内容', value: 6, range: [0, 2] },
  { name: '行驶里程', description: '描述内容', value: 1125, range: [200, 500] },
  { name: '项目完成率', description: '描述内容', value: 0.75, range: [0.8, 1] },
  { name: '指标4', value: 32, range: [10, 60] },
  { name: '指标5', value: 14, range: [5, 20] },
  { name: '指标6', description: '描述内容', value: 75, range: [5, 8] },
  { name: '周请假次数2', value: 6, range: [0, 2] },
  { name: '指标7', value: 32, range: [10, 60] },
  { name: '指标8', description: '描述内容', value: 14, range: [5, 20] },
  { name: '行驶里程2', value: 1125, range: [200, 500] },
  { name: '项目完成率3', value: 0.75, range: [0.8, 1] },
  { name: '指标9', description: '描述内容', value: 75, range: [5, 8] },
  { name: '行驶里程3', value: 1125, range: [200, 500] },
  { name: '项目完成率4', description: '描述内容', value: 0.75, range: [0.8, 1] },
  { name: '周请假次数5', value: 6, range: [0, 2] },
]
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
