const route = {
  path: 'applyExportXls',
  component: () => import('@/views/ApplyExportXls'),
  name: 'ApplyExportXls',
  meta: {
    title: 'application.setting.application.exportXls',
    verify: 'on',
    icon: 'file'
  }
}
export default route
