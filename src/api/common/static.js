import request from '@/utils/request'

/**
 * 刷新验证码
 *
 * @export
 * @returns
 * id   guid    验证码的id
 * posY int     前景图片y坐标
 */
export function verify() {
  return request.get('static/verify')
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
    params: { code }
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
  return request({
    url: '/static/location',
    method: 'get',
    code
  })
}

/**
 *导出单个申请
 *
 * @export
 * @param {*} templete
 * @param {*} query
 */
export function exportSingleApply(templete, query) {
  return request.post('static/exportApply', {
    templete,
    query
  }).then(data => {
    downloadUrl(data.requestUrl)
  })
}
/**
 *导出多个申请
 *
 * @export
 * @param {*} templete
 * @param {*} query
 */
export function exportMultiApplies(templete, query) {
  return request.post('static/exportApplies', {
    templete,
    query
  }).then(data => {
    downloadUrl(data.requestUrl)
  })
}

export function downloadUrl(url) {
  var requestUrl = process.env.VUE_APP_BASEURL + url
  var a = document.createElement('a')
  a.href = requestUrl
  a.click()
}
/**
 *导出指定用户申请
 *
 * @export
 * @param {*} dutiesType
 * @param {*} applies
 */
export function exportUserApplies(dutiesType, applies) {
  var templete = '干部休假登记卡.xlsx'
  switch (dutiesType) {
    case 1: templete = '人员休假登记卡.xlsx'
  }
  return exportMultiApplies(templete, {
    Arrays: applies
  })
}

/**
 *导出申请详情
 *
 * @export
 * @param {*} dutiesType
 * @param {*} id
 */
export function exportApplyDetail(dutiesType, id) {
  var templete = '干部请假单.xlsx'
  switch (dutiesType) {
    case 1: templete = '人员请假单.xlsx'
  }
  return exportSingleApply(templete, {
    Value: id
  })
}
