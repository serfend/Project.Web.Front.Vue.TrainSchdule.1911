import request from '../utils/request'

const apiURL = process.env.VUE_APP_BASE_API
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

const exportPath = apiURL + '/static/xlsExport'

/**
 * 下载
 * @param {*} data
 */
const exportXSL = (data) => {
  let str = '?'
  const params = Object.keys(data).map(key => {
    return key + '=' + data[key]
  })
  str += params.join('&')
  window.open(exportPath + str, '_black')
}

/**
 * 导出休假登记模版
 * @param {{
    "templete":"干部休假登记卡.xlsx",
      "user":"ADJC1AH121"
  }} params
 */
export function exportUserApplies(user, templete = '干部休假登记卡.xlsx') {
  return exportXSL({
    templete,
    user
  })
}

/**
 * 导出休假请求列表
 * @param {{
    "templete":"休假人员统计表.xlsx",
    "Model":{
      "apply":"ADJC1AH121"
    }
  }} params
 */
export function exportApply(apply, templete = '干部请假单.xlsx') {
  return exportXSL({
    templete,
    apply
  })
}

/**
 * 导出汇总状态
 * @param {{
    "templete":"休假人员统计表.xlsx",
    "Model":{
      "company":"ADJC1AH121"
    }
  }} params
 */
export function exportCompanyApplies(company, templete = '休假人员统计表.xlsx') {
  alert(company)
  return exportXSL({
    templete,
    company
  })
}
