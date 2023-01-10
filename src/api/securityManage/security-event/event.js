import request from '@/utils/request'
import form from '@/utils/form'
const api = 'securityManageEvent'

/**
 * 获取指定范围内的历史事件
 * 例如历史每年/每季度/每月 上的今天
 * @export
 * @params:
      securityEventType enum 事件周期类型(none:0 day:1 week:2 month:3 season:4 year:5)

      securityEventPeriod enum 事件周期范围(none:0 week:1 month:2 season:3 year:4)

      eventType string 事件类型
      eventTag string 事件标签
      eventCompany string 事件归属单位
      page 分页
 * @return {*}
 */
export function eventList({
  databaseName,
  title,
  detail,
  summary,
  tag,
  time,
  filterDate,
  securityEventType,
  securityEventPeriod,
  eventType,
  eventTag,
  eventCompany,
  page
}) {
  const data = {
    databaseName: form.toQueryValue(databaseName),
    securityEventType: form.toQueryStartEndByArray([
      securityEventType,
      securityEventType
    ]),
    securityEventPeriod: form.toQueryStartEndByArray(securityEventPeriod),
    type: form.toQueryStartEndByArray([eventType, eventType]),
    eventTag: form.toQueryValue(eventTag),
    company:
      eventCompany && eventCompany.length
        ? form.toQueryArrays(eventCompany)
        : null,
    title: form.toQueryValue(title),
    detail: form.toQueryValue(detail),
    summary: form.toQueryValue(summary),
    tag: form.toQueryValue(tag),
    time: form.toQueryStartEndByArray(time),
    filterDate: form.toQueryStartEndByArray(filterDate),
    page
  }
  return request.post(`${api}/list`, data)
}
export function dictionary() {
  return request.get(`${api}/types`)
}

/**
 * 获取单位标签
 *
 * @export
 * @param {*} company
 * @return {*}
 */
export function eventCompany(company) {
  return request.get(`${api}/eventCompany?company=${company}`)
}
