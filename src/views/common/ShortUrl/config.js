const baseurl = require('@/utils/website').getWebLocation()
export function shortUrlContent(key) {
  return `${baseurl}/s/${key}`
}
