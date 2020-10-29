import request from '@/utils/request'

/**
 * 获取评论
 *
 * @export
 * @param {String} id 休假申请的id
 * @param {String} order as_date/as_popularity
 * @param {Number} pageIndex
 * @param {Number} pageSize
 * @returns
 */
export function getComments(params) {
  return request({
    url: '/apply/comment',
    method: 'get',
    params
  })
}

/**
 * 修改/删除/新建评论
 *
 * @export
 * @param {String} id 评论的id，仅删除和修改时需要
 * @param {String} apply 休假申请的id
 * @param {Boolean} isRemove 是否删除
 * @param {String} content 内容
 * @returns
 */
export function postComments(data) {
  return request({
    url: '/apply/comment',
    method: 'post',
    data
  })
}

/**
 * 修改/删除/新建评论
 *
 * @export
 * @param {String} id 评论的id
 * @param {Boolean} like 是否赞
 * @returns
 */
export function likeComments(data) {
  return request({
    url: '/apply/commentLike',
    method: 'post',
    data
  })
}
