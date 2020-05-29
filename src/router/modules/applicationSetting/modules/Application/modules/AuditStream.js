const route = {
  path: 'applyAuditStream',
  component: () => import('@/views/ApplyStream'),
  name: 'ApplyAuditStream',
  meta: {
    title: 'application.setting.application.auditStream',
    verify: 'on',
    icon: 'memo'
  }
}
export default route
