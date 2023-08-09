import { dataToStandard } from '@/utils/form'
export function templateToStandard(data, ratingTypeCycleDesc, ratingTypeItem) {
  data = dataToStandard(data)
  const ratingType = ratingTypeItem[0]
  const valid = ratingTypeCycleDesc && ratingType
  const prefix = valid
    ? `${ratingTypeCycleDesc}${ratingType} - `
    : '常规 - '
  return { prefix, data }
}
