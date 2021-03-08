import { ratingTypeDict } from '../setting'
export const descList = ['一季度', '二季度', '三季度', '四季度']
export function ratingTypeItem(ratingType) {
  return ratingTypeDict[ratingType]
}
export function ratingTypeCycleToString(ratingType, cycleCount) {
  const d = new Date('2000-1-1')
  switch (ratingType) {
    // 日
    case 1: {
      break
    }
    // 周
    case 2: {
      break
    }
    // 月
    case 4: {
      d.setMonth(d.getMonth() + cycleCount)
      return `${d.getFullYear()}年${d.getMonth() + 1}月`
    }
    // 季度
    case 8: {
      cycleCount -= 1
      d.setMonth(cycleCount * 3)
      return `${d.getFullYear()}年${descList[cycleCount % 4]}`
    }
    // 年
    case 16: {
      d.setFullYear(d.getFullYear() + cycleCount)
      return `${d.getFullYear()}年度`
    }
    default: return null
  }
}
export function dateValueToCycleCount(ratingType, dateValue, descValue) {
  const v = dateValue
  if (!v) return 0
  switch (ratingType) {
    // 日
    case 1: {
      break
    }
    // 周
    case 2: {
      break
    }
    // 月
    case 4: {
      return (v.getFullYear() - 2000) * 12 + v.getMonth()
    }
    // 季度
    case 8: {
      const y = (v.getFullYear() - 2000) * 4
      const s = descList.findIndex(i => i === descValue)
      return y + (s === -1 ? 0 : s) + 1
    }
    // 年
    case 16: {
      return v.getFullYear() - 2000
    }
  }
}
export function dateValueToCycleDesc(ratingType, dateValue, descValue) {
  const count = dateValueToCycleCount(ratingType, dateValue, descValue)
  const r = ratingTypeCycleToString(ratingType, count)
  return r
}
