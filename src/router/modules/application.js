/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

/* Router Modules */
const applicationRouter = {
  path: '/application',
  component: Layout,
  redirect: 'noRedirect',
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
        // verify: 'on',
        icon: 'newapply'
      }
    },
    {
      path: 'myApply',
      component: () => import('@/views/MyApply'),
      name: 'MyApply',
      meta: {
        title: 'application.my',
        verify: 'on',
        icon: 'principal'
      }
    },
    {
      path: 'queryAndAuditApplies',
      component: () => import('@/views/QueryAndAuditApplies'),
      name: 'applicationList',
      meta: {
        title: 'application.audit',
        verify: 'on',
        icon: 'auditapply'
      }
    },
    {
      path: 'applyDetail',
      component: () => import('@/views/ApplyDetail'),
      name: 'ApplyDetail',
      meta: {
        title: 'application.detail',
        verify: 'on',
        icon: 'menu-outoforder'
      },
      hidden: true
    }
  ]
}

export default applicationRouter
