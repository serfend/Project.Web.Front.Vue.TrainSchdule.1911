import request from '@/utils/request'
const api = 'securityFaceRecord'

export function batchFaceRecord({ pageIndex, pageSize }) {
  return request.post(`${api}/securityWarnings`, {
    params: { pageIndex, pageSize }
  })
}

export function faceRecords({ items }) {
  return request.post(`${api}/FaceRecords`, items)
}
