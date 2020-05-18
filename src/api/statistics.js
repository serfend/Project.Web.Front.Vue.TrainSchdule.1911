import request from '../utils/request'

export function details(companies, ids) {
  return request.post('vacationStatistics/DetailsList', {
    companyid: { arrays: companies },
    id: { arrays: ids }
  })
}

export function summary(company) {
  return request.get('vacationStatistics/summary', {
    params: {
      compainesCode: company
    }
  })
}
