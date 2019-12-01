import request from '../utils/request'

/**
 *查询指定用户的申请
 *
 * @export
 * @param {*} userid
 * @returns
 */
export function fromUser(userid) {
  const {
    id
  } = userid
  return request.get('/apply/fromUser', {
    params: {
      id
    }
  })
}

/**
 *获取归队时间
 *
 * @export
 * @param {*} params
 *      date  params.start
 *      int  params.length
 * @returns
 */
export function getStampReturn(params) {
  return request({
    url: '/static/vocationDate',
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
 * 保存申请
 * @param {String} id 申请的id
 */
export function save(id) {
  return request.put('/apply/Save?id=' + id)
}

/**
 * 发布申请
 * @param {String} id 申请的id required
 */
export function publish(id) {
  return request.put('/apply/Publish?id=' + id)
}

/**
 * 撤回申请
 * @param {String} id 申请的id required
 */
export function withdrew(id) {
  return request.put('/apply/Withdrew?id=' + id)
}

/**
 *查询用户管辖单位下需要审核的申请
 *
 * @export
 * @param {json} data
 *      {string} data.code 单位代码
 *      {string} data.id 用户id
 * @returns
 */
export function toUser(data) {

  return request.post('/apply/list', {params:data})
  // return request.get('/apply/toUser', {
  //   params: data
  // })
}

/**
 *查询指定单位的申请
 * @param {*} companyCode
 */
export function fromCompany(companyCode) {
  const {
    code
  } = companyCode
  return request.get('/apply/fromCompany', {
    params: {
      code
    }
  })
}

/**
 *查询指定单位的申请
 * @returns
 */
export function getAllStatus() {
  return request.get('/apply/allStatus')
}

/**
 *查询需要指定单位审核的申请
 *
 * @export
 * @param {*} companyCode
 * @returns
 */
export function toCompany(param) {
  return request.post('/apply/list', param)
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
 *召回
 *
 * @export
 * @param {*} id
 * @returns
 */
export function recallOrder(data) {
  return request.post('/apply/recallorder',data);
}
