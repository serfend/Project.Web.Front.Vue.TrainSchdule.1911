import request from '@/utils/request'
const api = 'securityManageEvent'

export function securityWarnings({ pageIndex, pageSize }) {
  return request.get(`${api}/securityWarnings`, {
    params: { pageIndex, pageSize }
  })
}

/**
 * 标记为已读或删除，传null则标记全局为已读，传空数组则获取当前已读数据
 *
 * @export
 * @param {*} { items[{id,isRemove}] }
 * @return {*}
 */
export function markAsRead ({ items }) {
  return request.post(`${api}/securityWarningsMarkAsRead`, items)
}
