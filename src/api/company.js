import request from '../utils/request'
/**
 * 获取单位的子单位
 *
 * @export
 * @param {string} id 单位id
 * @returns
 * {array} list:
 *  {json} list[i]:
 *      {string} list[i].name:""
 *      {string} list[i].code:""
 */
export function companyChild(id) {
  return request({
    url: '/company/companyChild',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 *获取单位主管列表
 *
 * @export
 * @param {string} id 单位id
 * @returns
 */
export function Managers(id) {
  return request({
    url: '/company/Managers',
    method: 'get',
    id
  })
}

/**
 * 获取多个单位的管理
 *
 * @export
 * @param {Array<String>} ids 单位id
 * @returns
 */
export function companiesManagers(ids) {
  return request.get('/company/companiesManagers', {
    params: {
      ids: ids.join('##')
    }
  })
}

/**
 * 获取单位人员列表
 * @param {*} param0
 */
export function getMembers({
  code, page, pageSize
}) {
  return request.get('/company/members', {
    params: {
      code, page, pageSize
    }
  })
}

/**
 * 获取职务详情
 *
 * @export
 * @param {*} name 职务名称
 * @returns
 */
export function dutiesDetail(name) {
  return request({
    url: '/company/dutiesDetail',
    method: 'get',
    params: {
      name
    }
  })
}

/**
 * 获取建议，通过职务名称的部分查询可能的职务
 *
 * @export
 * @param {*} name
 * @returns
 */
export function dutiesQuery(name) {
  return request({
    url: '/company/dutiesQuery',
    method: 'get',
    params: {
      name
    }
  })
}
export function companyTitleQuery(name) {
  return request({
    url: '/company/titleQuery',
    method: 'get',
    params: {
      name
    }
  })
}

