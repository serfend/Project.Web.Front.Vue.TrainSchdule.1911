import request from '@/utils/request'
import form from '@/utils/form'

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
 *按筛选查询申请列表
 *
 * @export
 * @param {QueryApplyModel} data
 * @param {Boolean} ignoreErr
 * @returns
 */
export function queryList(data, ignoreErr) {
  return request.post('/apply/list', data, {
    ignoreError: ignoreErr
  })
}

/**
 * 构造一个查询模型
 *
 * @export
 * @param {ApplyModel} model
    createTime: Array:Date*2,
    stampLeaveTime: Array:Date*2,
    stampReturnTime: Array:Date*2,
    status: [], // 状态
    executeStatus: null // 执行状态
    actionStatus: 'Received', // 我的状态
    auditBy: String,
    nowAuditBy: String,
    createFor: String,
    isMarried: bool, // 已婚
    isApart: bool, // 分居
    createCompany: Array:Company, // 申请单位
    isRemote: bool, // 偏远单位
    dutiesType: Array:String,
    companyType: Array:String
 * @param {Pages} pages
 */
export function createQueryApplyModel(model, pages) {
  const f = {
    pages: Object.assign({}, pages)
  }
  const userStatus =
    (model.isMarried ? 1 : 0) |
    (model.isApart ? 2 : 0)
  if (userStatus) f.userStatus = form.toQueryArrays([userStatus])
  const companyStatus =
    (model.isRemote ? 1 : 0)
  if (companyStatus) f.companyStatus = form.toQueryArrays([companyStatus])
  f.create = form.toQueryStartEndByArray(model.createTime)
  f.stampLeave = form.toQueryStartEndByArray(model.stampLeaveTime)
  f.stampReturn = form.toQueryStartEndByArray(model.stampReturnTime)
  f.status = form.toQueryArrays(model.status)
  f.executeStatus = form.toQueryValue(model.executeStatus)
  f.auditBy = form.toQueryValue(model.auditBy)
  f.nowAuditBy = form.toQueryValue(model.nowAuditBy)
  f.createCompany = form.toQueryArrays(model.createCompany)
  f.dutiesType = form.toQueryValue(model.dutiesType)
  f.companyType = form.toQueryValue(model.companyType)
  f.createFor = form.toQueryValue(model.createFor)

  f.auth = model.auth
  return f
}

/**
 * 查询需本人审批的申请
 *
 * @export
 * @param {Object} pages 分页
 * @param {Array} status 状态
 * @param {String} myAuditStatus 我的状态：accept,deny,unreceive,received,null
 * @param {int} executeStatus 落实状态
 */
export function queryMyAudit(pages, status, myAuditStatus, executeStatus) {
  pages = (!pages) ? {
    pageIndex: 0,
    pageSize: 20
  } : pages

  return request.get('/apply/listOfMyAudit', {
    params: {
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize,
      status: status.join('##'),
      actionStatus: myAuditStatus,
      executeStatus
    }
  })
}

/**
 * 查询本人申请
 *
 * @export
 * @param {*} pages 分页
 * @param {String} id 查询用户的id，默认为当前登录用户
 * @param {String} start 起始日期，默认为今年1月1日
 * @param {String} end 终止日期，默认为今天
 */
export function querySelf(pages, id, start, end) {
  pages = (!pages) ? {
    pageIndex: 0,
    pageSize: 20
  } : pages
  return request.get('/apply/listOfSelf', {
    params: {
      id,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize,
      start,
      end
    }
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
