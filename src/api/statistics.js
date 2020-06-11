import request from '../utils/request'
import {
  parseTime
} from '@/utils'

/**
 * 删除指定单位新增休假的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function removeAppliesNew(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesTargetNew')
}

/**
 * 删除指定单位完成休假的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function removeAppliesComplete(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesTargetComplete')
}

/**
 * 删除指定单位休假情况
 *
 * @export
 * @param {*} companyCode
 * @param {*} from
 * @param {*} to
 * @returns
 */
export function removeAppliesProcess(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesProcessRecord')
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
export function getAppliesNew(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'get', 'appliesTargetNew')
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
export function getAppliesComplete(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'get', 'appliesTargetComplete')
}

/**
 * 获取指定单位休假情况
 *
 * @export
 * @param {*} companyCode
 * @param {*} from
 * @param {*} to
 * @returns
 */
export function getAppliesProcess(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'get', 'appliesProcessRecord')
}

export function appliesStatistics(companyCode, from, to, action, path) {
  return request[action](`vacationStatistics/${path}`, {
    params: {
      companyCode,
      from: parseTime(from),
      to: parseTime(to)
    }
  })
}
