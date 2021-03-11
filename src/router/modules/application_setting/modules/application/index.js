import AuditStream from './modules/AuditStream'
import Export from './modules/Export'
const route = {
  path: 'application',
  component: () => import('@/views/blank'),
  name: 'Application',
  meta: {
    ctitle: '数据管理',
    icon: 'task_done'
  },
  children: [AuditStream, Export,
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/redirect'),
      name: 'Dashboard',
      meta: {
        title: 'dashboard',
        icon: 'chart',
        hide_footer: true
      }
    }]
}
export default route
