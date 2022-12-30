const route = {
  path: 'general-config',
  component: () => import('@/views/common/GeneralConfig'),
  name: 'GeneralConfig',
  meta: {
    ctitle: '通用配置',
    icon: 'workset'
  },
}
export default route
