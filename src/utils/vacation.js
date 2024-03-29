import { datedifference, parseTime, relativeDate } from './index'
const handle_detail = {}
handle_detail.vacation = request => {
  let detail
  if (request) {
    const addtional = request.additialVacations
    const ad_detail =
      (addtional && addtional.reduce((prev, cur) => prev + cur.length, 0)) || 0
    const on_trip = request.onTripLength || 0
    const date_length = request.vacationLength || 0
    const total = ad_detail + on_trip + date_length
    const target = request.vacationPlace.name
    let target_name = request.vacationPlaceName || ''
    if (target_name) target_name = `(${target_name})`
    const vtype = request.vacationType
    let length_detail = `${vtype}${date_length}天`
    if (on_trip) length_detail = `${length_detail},${on_trip}天路途`
    if (ad_detail) length_detail = `${length_detail},${ad_detail}天额外`
    detail = `${vtype}${total}天(${length_detail})\n${target}${target_name}`
  } else detail = '无详细信息'
  return detail.replace(' 00:00:00', '')
}
handle_detail.inday = request => {
  if (!request) return '无详情'
  const { stampLeave, stampReturn } = request
  const sl = relativeDate(stampLeave) + parseTime(stampLeave, '{h}:{i}:{s}')
  const sr = relativeDate(stampReturn) + parseTime(stampReturn, '{h}:{i}:{s}')
  const deltaMinute = datedifference(stampReturn, stampLeave, 'minute')
  const minDesc = deltaMinute % 60 ? `${deltaMinute % 60}分钟` : ''
  const r = `${sl} - ${sr} (${Math.floor(deltaMinute / 60)}小时${minDesc})`
  return r
}
export function get_item_summary(i, entityType) {
  const user = i.base
  const title = `${user.companyName}${user.dutiesName}`
  const request = i.request
  const detail = handle_detail[entityType](request)

  return `${title}\n${detail}`
}
export const MainStatus_IsPlan = 2
export const MainStatus_IsLimitByWork = 4
export function get_item_type(i) {
  if (!i) return {}
  const mainStatus = Number(i.mainStatus)
  return {
    isPlan: (mainStatus & MainStatus_IsPlan) > 0,
    isForWork: (mainStatus & MainStatus_IsLimitByWork) > 0
  }
}
export function formatApplyItem (li) {
  if (!li.request) return li
  const stampLeave = new Date(li.request.stampLeave)
  const stampReturn = new Date(li.request.stampReturn)
  li.stampLeave = stampLeave
  li.stampReturn = stampReturn
  li.isReplentApply = stampLeave <= new Date(li.create)
  li.type = get_item_type(li)
  return li
}
const defaultExecuteStatusDict = {
  1: '已归队',
  2: '已召回',
  4: '推迟归队'
}
export function indayApplyExecuteStatusDesc(
  executeStatus,
  executeStatusDict = null
) {
  if (!executeStatusDict) executeStatusDict = defaultExecuteStatusDict
  const desc = Object.keys(executeStatusDict)
    .map(v => {
      if (executeStatus & Number(v)) return executeStatusDict[v]
    })
    .filter(x => x)
  return desc && desc.length ? desc.join('\n') : '未确认'
}
