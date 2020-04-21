import request from '../utils/request'

export function details(companies, ids) {
  return request.post('VocationStatistics/DetailsList', {
    companyid: { arrays: companies },
    id: { arrays: ids }
  })
}

export function summary(company) {
  return request.get('VocationStatistics/summary', {
    params: {
      compainesCode: company
    }
  })
}
