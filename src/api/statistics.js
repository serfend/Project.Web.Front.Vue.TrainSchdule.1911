import request from '../utils/request'

export function details(companies, ids) {
  return request.post('VocationStatistics/DetailsList', {
    companyid: { array: companies },
    id: { array: ids }
  })
}

export function summary(company) {
  return request.get('VocationStatistics/summary', {
    companycode: company
  })
}
