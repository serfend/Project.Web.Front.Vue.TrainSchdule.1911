import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || 'XJXT'
export default function getPageTitle(meta) {
  const i18n_title = meta.ititle
  const direct_title = meta.title
  if (direct_title) return `${title} - ${direct_title}`
  const hasKey = i18n.te(`route.${i18n_title}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${i18n_title}`)
    return `${pageName} - ${title}`
  }
  return title
}
export function generateTitle(meta) {
  const i18n_title = meta.ititle
  const direct_title = meta.title
  if (direct_title) return direct_title
  const hasKey = i18n.te(`route.${i18n_title}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${i18n_title}`)
    return pageName
  }
  return i18n_title
}
