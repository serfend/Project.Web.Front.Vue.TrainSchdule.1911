import request from '../utils/request'

export function details(companies, ids, pages) {
  return request.post('vacationStatistics/DetailsList', {
    companyid: { arrays: companies },
    id: { arrays: ids },
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
