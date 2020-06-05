import request from '../utils/request'

export function details(companies, ids, pages) {
  return request.post('vacationStatistics/DetailsList', {
    companyid: {
      arrays: companies
    },
    id: {
      arrays: ids
    },
    pages
  })
}

export function summary(company) {
  return request.get('vacationStatistics/summary', {
    params: {
      companiesCode: company
    }
  })
}

/**
 * 获取指定单位新增休假的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function appliesNew(companyCode, from, to) {
  return request.get('vacationStatistics/appliesTargetNew', {
    params: {
      companyCode,
      from,
      to
    }
  })
}

/**
 * 获取指定单位完成休假的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function appliesComplete(companyCode, from, to) {
  return request.get('vacationStatistics/appliesTargetComplete', {
    params: {
      companyCode,
      from,
      to
    }
  })
}
