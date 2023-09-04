import request from '@/utils/request'
import form from '@/utils/form'
const api = 'securityFaceRecord'
import { cached_data } from '@/utils/cache'

/**
 * 查询门禁日志
 *
 * @export
 * @param {*} { device, user, company, created, page }
 * @return {*}
 */
export function faceRecords({
  device,
  user,
  company,
  created,
  page,
  description
}) {
  return request.post(`${api}/faceRecords`, {
    device: form.toQueryValue(device),
    description: form.toQueryValue(description),
    user: form.toQueryValue(user),
    company: form.toQueryValue(company),
    created: form.toQueryStartEndByArray(created),
    page
  })
}

/**
 * 查询门禁策略记录
 *
 * @export
 * @param {*} { user, company, timeStart, timeEnd, page }
 * @return {*}
 */
export function faceLockRecords({ user, company, timeStart, timeEnd, page }) {
  return request.post(`${api}/faceLockStatus`, {
    user: form.toQueryValue(user),
    company: form.toQueryValue(company),
    timeStart: form.toQueryStartEndByArray(timeStart),
    timeEnd: form.toQueryStartEndByArray(timeEnd),
    page
  })
}

const urlFaceDeviceOptions = `${api}/faceDeviceOptions`
export function faceDeviceOptions() {
  return cached_data(`${urlFaceDeviceOptions}`, () =>
    request.get(urlFaceDeviceOptions)
  )
}
