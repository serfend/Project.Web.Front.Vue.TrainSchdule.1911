const route = {
  path: 'versionHandle',
  component: () => import('@/views/UpdateRecord'),
  name: 'UpdateRecord',
  meta: {
    title: 'application.setting.updateRecord',
    verify: 'on',
    icon: 'fanhuima'
  }
}
export default route
