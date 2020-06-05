import request from '@/utils/request'

/**
 * 获取更新记录
 *
 * @export
 * @param {*} pageIndex
 * @param {*} pageSize
 * @returns
 */
export function getUpdateRecord(pageIndex, pageSize) {
  return request.get('common/updateVersion', {
    params: {
      pageIndex,
      pageSize
    }
  })
}

/**
 * 创建编辑删除
 *
 * @export
 * @param {*} model 当IsRemove=true表示删除，以Version为主键
 * @returns
 */
export function modifyUpdateRecord(model, auth) {
  return request.post('common/updateVersion', {
    data: model,
    auth
  })
}
