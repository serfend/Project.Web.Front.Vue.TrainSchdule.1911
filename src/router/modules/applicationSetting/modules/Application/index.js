import AuditStream from './modules/AuditStream'
import Export from './modules/Export'
const route = {
  path: 'application',
  component: () => import('@/views/blank'),
  name: 'Application',
  meta: {
    title: 'application.setting.application.title',
    verify: 'on',
    icon: 'task_done'
  },
  children: [AuditStream, Export]
}
export default route
