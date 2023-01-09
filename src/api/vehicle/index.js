import request from '@/utils/request'
import { cached_data } from '@/utils/cache'
import form from '@/utils/form'
const api = 'vehicle'
const urlgetVehicle = `${api}/vehicle`
/**
 * 获取载具信息
 *
 * @export
 * @param {*} id
 * @param {*} ignoreErr 是否忽略错误
 * @returns
 */
export function getVehicle(id, ignoreErr) {
  const action = () =>
    request.get(`${urlgetVehicle}/${id}`, {
      ignoreError: ignoreErr
    })

  return id ? cached_data(`${urlgetVehicle}/${id}`, action
  ) : action()
}

export function getTravelList ({ driverId, vehicleIdentity, page }) {
  return request.post(`${api}/travelList`, {
    driverId: form.toQueryValue(driverId),
    vehicleIdentity: form.toQueryValue(vehicleIdentity),
    page
  })
}
