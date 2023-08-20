import request from '@/utils/request'
import form from '@/utils/form'
const api = 'securityFaceRecord'

export function search_devices ({ district, company, ip, id, create, name, type, page }) {
  return request.post(`${api}/devices`, {
    district: form.toQueryValue(district),
    securityEventType: form.toQueryStartEndByArray([
      district,
      district
    ]),
    company:
      company && company.length
        ? form.toQueryArrays(company)
        : null,
    type: form.toQueryValue(type),
    name: form.toQueryValue(name),
    id: form.toQueryValue(id),
    ip: form.toQueryValue(ip),
    create: form.toQueryStartEndByArray(create),
    page
  }
  )
}

/**
 * 批量编辑设备
 *
 * @export
 * @param {*} {
 * data:list[item]
 *  {name:string,company:string,district:int,type:string,create:datetime},
 * auth
 * }
 * @return {*}
 */
export function batchDevice({ data, auth }) {
  return request.post(`${api}/batchDevice`, { data, auth }
  )
}
