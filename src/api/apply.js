import request from '../utils/request'

/**
 *获取归队时间
 *
 * @export
 * @param {*} params
 *      date  params.start
 *      int  params.length
 *      boolean params.caculateLawVacation
 * @returns
 */
export function getStampReturn(params) {
  return request({
    url: '/static/vacationDate',
    method: 'get',
    params: params
  })
}

/**
 *导出excel接口
 *
 * @export
 * @param {*} params
 *        string params.Templete 使用的模板名称
 *        json params.Model 数据模型
 *            string Model.user 用户id
 *            string Model.company 单位代码
 *            string Model.apply 申请的id
 * @returns
 */
export function excelReport(params) {
  return request({
    url: '/static/xlsExport',
    method: 'get',
    params: params
  })
}

/**
 * 提交基本信息
 * @param {*} data 基本信息参数
 */
export function postBaseInfo(data) {
  return request.post('/apply/BaseInfo', data)
}

/**
 * 提交请求信息
 * @param {*} data 请求参数
 */
export function postRequestInfo(data) {
  return request.post('/apply/RequestInfo', data)
}

/**
 * 提交申请
 * @param {
   {
    "BaseId": String,
    "RequestId": String,
    "Verify":{
      "Code": String
    }
  } data 申请的参数，包含基本信息和请求返回的两个id
 */
export function submitApply(data) {
  return request.post('/apply/Submit', data)
}

/**
 *  删除申请
 * @param {json} params
 *      {string} params.id
 *      {Auth}   params.Auth
 */
export function deleteApply(params) {
  return request({
    url: '/apply/Submit',
    method: 'delete',
    data: params
  })
}

/**
 * 操作申请
 * @param {String} action 操作类型 required
 * @param {String} id 申请的id required
 */
export function doAction(action, id) {
  return request.put(`/apply/${action}?id=${id}`)
}

/**
 *按筛选查询申请列表
 *
 * @export
 * @param {QueryApplyModel} data
 * @param {Boolean} ignoreErr
 * @returns
 */
export function queryList(data, ignoreErr) {
  return request.post('/apply/list', data, {
    respondErrorIngore: ignoreErr
  })
}

/**
 *查询所有状态
 * @returns
 */
export function getAllStatus() {
  return request.get('/apply/allStatus')
}

/**
 * 查询需本人审批的申请
 *
 * @export
 * @param {Object} pages 分页
 * @param {Array} status 状态
 * @param {String} myAuditStatus 我的状态：accept,deny,unreceive,received,null
 */
export function queryMyAudit(pages, status, myAuditStatus) {
  pages = (!pages) ? { pageIndex: 0, pageSize: 20 } : pages

  return request.get('/apply/listOfMyAudit', {
    params: {
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize,
      status: status.join('##'),
      actionStatus: myAuditStatus
    }
  })
}

/**
 * 查询本人申请
 *
 * @export
 * @param {*} pages 分页
 * @param {String} id 查询用户的id，默认为当前登录用户
 */
export function querySelf(pages, id) {
  pages = (!pages) ? { pageIndex: 0, pageSize: 20 } : pages
  return request.get('/apply/listOfSelf', {
    params: {
      id,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize
    }
  })
}

/**
 *批量审批
 *
 * @export
 * @param {Arr[json]} data
 *      data:{
 *        List:{
 *          id:
 *          action:
 *          remark:
 *        },
 *        ...
 *      }
 * @param {Auth} Auth
 * @returns
 */
export function audit(data, auth) {
  return request.post('/apply/audit', {
    data,
    auth
  })
}

/**
 *查询申请详情
 *
 * @export
 * @param {*} id
 * @returns
 */
export function detail(id) {
  return request('/apply/detail', {
    params: {
      id
    }
  })
}
/**
 *
 *
 * @export
 * @param {*} data
 * @returns
 */
export function postRecallOrder(data) {
  return request.post('/apply/recallorder', data)
}
/**
 * 获取召回信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getRecallOrder(id) {
  return request.get('/apply/recallorder', {
    params: {
      id
    }
  })
}
