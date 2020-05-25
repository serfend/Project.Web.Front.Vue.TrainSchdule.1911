import Layout from '@/layout'
const applicationSettingRouter = {
  path: '/applicationSetting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'applicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [
    {
      path: 'applyAuditStream',
      component: () => import('@/views/ApplyStream'),
      name: 'ApplyAuditStream',
      meta: {
        title: 'application.setting.auditStream',
        verify: 'on',
        icon: 'memo'
      }
    }, {
      path: 'applyExportXls',
      component: () => import('@/views/ApplyExportXls'),
      name: 'ApplyExportXls',
      meta: {
        title: 'application.setting.exportXls',
        verify: 'on',
        icon: 'file'
      }
    }
  ]
}

export default applicationSettingRouter
