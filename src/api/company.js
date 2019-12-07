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
    url: '/company/child',
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
* {array} list:
 *  {json} list[i]:
 *      {string} list[i].realName:"测试管理员"
 *      {string} list[i].duties:"助理工程师"
 *      {string} list[i].company:""
 *      {string} list[i].id:"1000000"
 */
export function Managers(id) {
  return request({
    url: '/company/Managers',
    method: 'get',
    id
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
