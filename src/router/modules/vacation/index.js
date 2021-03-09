/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import application from '../application_setting/modules/application'
/* Router Modules */
const applicationRouter = {
  path: '/vacation',
  component: Layout,
  redirect: 'noRedirect',
  name: 'vacation',
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
        icon: 'newapply'
      }
    },
    {
      path: 'myApply',
      component: () => import('@/views/MyApply'),
      name: 'MyApply',
      meta: {
        title: 'application.my',
        icon: 'principal'
      }
    },
    {
      path: 'queryAndAuditApplies',
      component: () => import('@/views/QueryAndAuditApplies'),
      name: 'applicationList',
      meta: {
        title: 'application.audit',
        icon: 'auditapply'
      }
    },
    {
      path: 'applyDetail',
      component: () => import('@/views/ApplyDetail'),
      name: 'ApplyDetail',
      meta: {
        title: 'application.detail',
        icon: 'menu-outoforder'
      },
      hidden: true
    },
    application
  ]
}

export default applicationRouter
