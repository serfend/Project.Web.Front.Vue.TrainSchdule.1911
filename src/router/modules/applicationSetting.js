
import Layout from '@/layout'

const applicationSettingRouter = {
  path: '/applicationSetting',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'applicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'applyAuditStream',
      component: () => import('@/views/ApplyStream'),
      name: 'ApplyAuditStream',
      meta: {
        title: 'application.setting.auditStream',
        verify: 'on',
        icon: 'component'
      }
    }, {
      path: 'applyExportXls',
      component: () => import('@/views/ApplyExportXls'),
      name: 'ApplyExportXls',
      meta: {
        title: 'application.setting.exportXls',
        verify: 'on',
        icon: 'component'
      }
    }
  ]
}

export default applicationSettingRouter
