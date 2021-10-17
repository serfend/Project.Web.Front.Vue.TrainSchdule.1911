export function getWebLocation() {
  const url = process.env.VUE_APP_BASE_API
  return url || location.href
}
