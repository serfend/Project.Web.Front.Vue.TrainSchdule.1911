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
 *导出休假登记模版
 *
 * @export
 * @param {*} user
 * @param {*} dutiesType
 * @returns
 */
export function exportUserApplies(user, dutiesType) {
  console.log('exportUserApplies' + dutiesType)
  var templete = '干部休假登记卡.xlsx'
  switch (dutiesType) {
    case 1: templete = '人员休假登记卡.xlsx'
  }
  return exportXSL({
    templete,
    user
  })
}

/**
 *导出休假请求列表
 * this.$store.state.user.dutiesType
 * @export
 * @param {*} apply
 * @param {*} dutiesType
 * @returns
 */
export function exportApply(apply, dutiesType) {
  console.log('exportApply' + dutiesType)
  var templete = '干部请假单.xlsx'
  switch (dutiesType) {
    case 1: templete = '人员请假单.xlsx'
  }
  return exportXSL({
    templete,
    apply
  })
}

/**
 *导出汇总状态
 *
 * @export
 * @param {*} company
 * @param {string} dutiesType
 * @returns
 */
export function exportCompanyApplies(company, dutiesType) {
  console.log('exportCompanyApplies' + dutiesType)
  var templete = '休假人员统计表.xlsx'
  return exportXSL({
    templete,
    company
  })
}
