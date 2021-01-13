import { datedifference } from './index'
export function get_item_summary(i) {
  const user = i.base
  const title = `${user.companyName}${user.dutiesName}`
  const request = i.request
  let detail
  if (request) {
    const addtional = request.additialVacations
    const ad_detail = addtional.reduce((prev, cur) => prev + cur.length, 0) || 0
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
  return `${title}\n${detail}`
}
const MainStatus_IsPlan = 2
export function get_item_type(i) {
  const result = {
    isPlan: (i.mainStatus & MainStatus_IsPlan) > 0
  }
  return result
}

export function get_item_stamp(i) {
  let result = i.tag && i.tag.stamp
  if (!result) {
    if (!i.tag) i.tag = {}
    i.tag.stamp = new Date((i.request && i.request.stampLeave) || i.create)
    result = i.tag.stamp
  }
  i.tag.year = i.tag.stamp.getFullYear()
  return result
}
export function check_label(i, prei) {
  const iStamp = get_item_stamp(i)
  const pStamp = get_item_stamp(prei)
  const from_last = datedifference(iStamp, pStamp)
  if (from_last === 0) return
  put_label(i)
}
export function put_label(item, from_now) {
  // item.tag.title = from_now < 0 ? '未来' : from_now === 0 ? '今天' : from_now === 1 ? '昨天' : null
  // if (item.tag.title) return
  const m = item.tag.stamp.getMonth() + 1
  item.tag.title = `${m}月`
  item.tag.desc = item.tag.stamp.getDate()
}
export function tag_single_item(list, index) {
  const item = list[index]
  if (item.tag && item.tag.labeled) return
  get_item_stamp(item)
  if (index === 0) put_label(item)
  else check_label(item, list[index - 1])
  return
}
