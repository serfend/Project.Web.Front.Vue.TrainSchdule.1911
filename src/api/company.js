import request from '@/utils/request'
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
  return request.get('company/companyChild', {
    params: {
      id: id
    }
  })
}

/**
 * 获取单位信息
 *
 * @export
 * @param {*} id
 */
export function companyDetail(id) {
  return request.get('company/detail', {
    params: {
      id
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
export function Managers(id, userid) {
  return request({
    url: '/company/Managers',
    method: 'get',
    params: {
      id,
      userid
    }
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
  code,
  page,
  pageSize
}) {
  return request.get('/company/members', {
    params: {
      code,
      page,
      pageSize
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
 * @param {*} tag
 * @param {*} page
 * @returns
 */
export function dutiesQuery(name, tag, page) {
  page = page || {
    pageSize: 20,
    pageIndex: 0
  }
  const {
    pageSize,
    pageIndex
  } = page
  return request({
    url: '/company/dutiesQuery',
    method: 'get',
    params: {
      name,
      tag,
      pageSize,
      pageIndex
    }
  })
}

/**
 * 查询职务类别
 *
 * @export
 * @param {*} tagName
 * @returns
 */
export function dutiesTag(tagName) {
  return request({
    url: 'company/dutiesTag',
    method: 'get',
    params: {
      tag: tagName
    }
  })
}

/**
 * 职级查询
 *
 * @export
 * @param {*} name
 * @param {*} tag
 * @param {*} page
 * @returns
 */
export function companyTitleQuery(name, tag, page) {
  page = page || {
    pageSize: 20,
    pageIndex: 0
  }
  const {
    pageSize,
    pageIndex
  } = page
  return request({
    url: '/company/titleQuery',
    method: 'get',
    params: {
      name,
      tag,
      pageSize,
      pageIndex
    }
  })
}

/**
 * 查询职务等级类别
 *
 * @export
 * @param {*} tagName
 * @returns
 */
export function companyTitleTag(tagName) {
  return request({
    url: 'company/titleTag',
    method: 'get',
    params: {
      tag: tagName
    }
  })
}

export function companyTag(tag, page) {
  page = page || {
    pageSize: 20,
    pageIndex: 0
  }
  return request({
    url: 'company/companyTag',
    method: 'get',
    params: {
      tag,
      pageSize: page.pageSize,
      pageIndex: page.pageIndex
    }
  })
}
