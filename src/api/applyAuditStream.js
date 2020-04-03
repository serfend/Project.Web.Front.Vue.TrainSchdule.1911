import request from '../utils/request'

/**
 * 获取审批节点
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getStreamNode(name) {
  return request.get('ApplyAuditStream/StreamNode', {
    params: {
      name
    }
  })
}

/**
 * 获取审批流方案
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getStreamSolution(name) {
  return request.get('ApplyAuditStream/StreamSolution', {
    params: {
      name
    }
  })
}

/**
 * 获取审批流方案规则
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getStreamSolutionRule(name) {
  return request.get('ApplyAuditStream/StreamSolutionRule', {
    params: {
      name
    }
  })
}

/**
 * MembersFilter ctor.
 *
 * @export
 * @param {Array} duties 职务列表
 * @param {int} dutyIsMajor 是否为主官 0:Both 1:仅非主官 2:仅主官
 * @param {Array} companies 单位
 * @param {String} companyRefer 单位跳转设置：Parent，Self
 * @param {Array} companyTags 单位筛选设置，可以设置为单位的Tag字段
 * @param {Array} companyCodeLength 单位筛选设置，可以设置为单位的Code字段长度
 * @param {Array} auditMembers 精确表示审核人，设置后前面项失效
 * @param {int} auditMembersCount 需要审核人数量 0表示全部
 * @returns
 */
export function buildFilter(duties, dutyIsMajor, companies, companyRefer, companyTags, companyCodeLength, auditMembers, auditMembersCount) {
  return {
    duties, dutyIsMajor, companies, companyRefer, companyTags, companyCodeLength, auditMembers, auditMembersCount
  }
}

/**
 * 新增一个审批节点
 *
 * @export
 * @param {String} name 名称
 * @param {String} description 描述
 * @param {Filter} filter 请调用`buildFilter进行构造`
 * @param {Auth} auth 授权码
 * @returns
 */
export function addStreamNode(name, description, filter, auth) {
  return request.post('ApplyAuditStream/StreamNode', {
    name, description,
    filter,
    auth
  })
}

/**
 * 创建一个审批流解决方案
 *
 * @export
 * @param {String} name 名称
 * @param {String} description 描述
 * @param {Array} nodes 节点名称
 * @param {Auth} auth 授权码
 * @returns
 */
export function addStreamSolution(name, description, nodes, auth) {
  return request.post('ApplyAuditStream/StreamSolution', {
    name, description, nodes, auth
  })
}

/**
 * 编辑一个审批流解决方案
 *
 * @export
 * @param {String} name 名称
 * @param {String} description 描述
 * @param {Array} nodes 节点名称
 * @param {Auth} auth 授权码
 * @returns
 */
export function editStreamSolution(name, description, nodes, auth) {
  return request.put('ApplyAuditStream/StreamSolution', {
    name, description, nodes, auth
  })
}

/**
 * 创建一个匹配规则
 *
 * @export
 * @param {String} name 名称
 * @param {String} description 描述
 * @param {String} solutionName 规则符合后使用的解决方案
 * @param {Int} priority 优先级
 * @param {Boolean} enable 启用
 * @param {Filter} filter 请调用`buildFilter进行构造`
 * @param {Auth} auth 授权码
 * @returns
 */
export function addStreamSolutionRule(name, description, solutionName, priority, enable, filter, auth) {
  return request.post('ApplyAuditStream/StreamSolutionRule', {
    name, description, solutionName, priority, enable, filter, auth
  })
}

export function queryStreamNode() {
  return request.get('ApplyAuditStream/StreamNodeQuery')
}

export function queryStreamSolution() {
  return request.get('ApplyAuditStream/StreamSolutionQuery')
}

export function queryStreamSolutionRule() {
  return request.get('ApplyAuditStream/StreamSolutionRuleQuery')
}

export function deleteStreamNode(name, authByUserid, code) {
  return request.delete('ApplyAuditStream/StreamNode', {
    params: {
      name, authByUserid, code
    }
  })
}

export function deleteStreamSolution(name, authByUserid, code) {
  return request.delete('ApplyAuditStream/StreamSolution', {
    params: {
      name, authByUserid, code
    }
  })
}

export function deleteStreamSolutionRule(name, authByUserid, code) {
  return request.delete('ApplyAuditStream/StreamSolutionRule', {
    params: {
      name, authByUserid, code
    }
  })
}
