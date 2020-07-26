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

/**
 * 获取中心时间配置
 *
 * @export
 * @returns
 */
export function timeZone() {
  return request.get('systemStatic/timeZone')
}
/**
 *导出单个申请
 *
 * @export
 * @param {String} templete
 * @param {String} applyId
 */
export function exportSingleApply(templete, applyId) {
  return new Promise((res, rej) => {
    request.post('static/exportApply', {
      templete,
      query: {
        value: applyId
      }
    }).then(data => {
      downloadUrl(data.requestUrl)
      res(data)
    }).catch(e => rej(e))
  })
}
/**
 *导出多个申请
 *
 * @export
 * @param {String} templete
 * @param {Array} applies
 */
export function exportMultiApplies(templete, applies) {
  return new Promise((res, rej) => {
    request.post('static/exportApplies', {
      templete,
      query: {
        arrays: applies
      }
    }).then(data => {
      downloadUrl(data.requestUrl)
      res(data)
    }).catch(e => rej(e))
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
    case 1:
      templete = '人员休假登记卡.xlsx'
  }
  return exportMultiApplies(templete, applies)
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
    case 1:
      templete = '人员请假单.xlsx'
  }
  return exportSingleApply(templete, id)
}

/**
 * 当前RSA
 *
 * @export
 */
export function currentRSAKey() {
  return request.get('systemStatic/currentRSAKey')
}
