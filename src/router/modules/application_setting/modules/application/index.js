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
  children: [AuditStream, Export]
}
export default route
