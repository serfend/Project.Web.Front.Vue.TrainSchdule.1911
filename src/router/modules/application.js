/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const applicationRouter = {
  path: '/application',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true, // will always show the root menu
  name: 'application',
  meta: {
    title: 'application.title',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'newApply',
      component: () => import('@/views/NewApply'),
      name: 'newApplication',
      meta: {
        title: 'application.new',
        icon: '测试申请'
      }
    },
    {
      path: 'queryAndAuditApplies',
      component: () => import('@/views/QueryAndAuditApplies'),
      name: 'applicationList',
      meta: {
        title: 'application.query',
        verify: 'on',
        icon: '无序排列'
      }
    }
  ]
}

export default this
