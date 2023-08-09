import request from '@/utils/request'
/**
 * 获取菜单
 *
 * @export
 * @param {*} menuName
 * @return {*}
 */
export function getMenu(menuName) {
  return request.get('navigation/list', {
    params: { menuName }
  })
}

/**
 * 更新菜单
 *
 * @export
 * @param {*} { name, alias, description, icon, parent, svg, url }
 * @return {*}
 */
export function postMenu({ name, alias, description, icon, parent, svg, url }) {
  return request.post('navigation/info', { name, alias, description, icon, parent, svg, url })
}
/**
 * 刷新验证码
 *
 * @export
 * @returns
 * id   guid    验证码的id
 * posY int     前景图片y坐标
 */
export function verify() {
  return request.get('systemStatic/verifyCode')
}

/**
 * 获取指定行政区划子层级
 *
 * @export
 * @param {string} code 行政区划code
 * @returns
 * {array} list:
 *  {json} list[i]:
 *      {string} list[i].name:"东城区"
 *      {int} list[i].code:110101
 */
export function locationChildren(code) {
  return request({
    url: '/static/locationChildren',
    method: 'get',
    params: {
      code
    }
  })
}

/**
 *行政区划详情
 *
 * @export
 * @param {string} code
 * @returns
 *    {string} list[i].name:"东城区"
 *    {int} list[i].code:110101
 */
export function location(code) {
  return request.get('/static/location', {
    params: {
      code
    }
  })
}

export function locations (codes) {
  if (Object.prototype.toString.call(codes) === '[object Array]')codes = codes.join('##')
  return request.get(`/static/locations?codes=${codes}`)
}
/**
 * 获取中心时间配置
 *
 * @export
 * @returns
 */
export function timeZone() {
  return request.get('systemStatic/timeZone')
}

export function downloadUrl(url) {
  var a = document.createElement('a')
  a.href = require('@/utils/website').getWebUrlPath(url)
  a.click()
}

/**
 * 当前RSA
 *
 * @export
 */
export function currentRSAKey() {
  return request.get('systemStatic/currentRSAKey')
}
