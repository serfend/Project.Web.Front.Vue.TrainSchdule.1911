// import Layout from '@/layout'

const router = {
  path: '/security-manage',
  component: () => import('@/views/blank'),
  meta: {
    title: 'SecurityManage',
    icon: 'security-safe'
  },
  children: [
    {
      path: 'history',
      component: () => import('@/views/SecurityManage/history'),
      name: 'History',
      meta: {
        title: 'history',
        icon: 'user',
        hide_footer: true
      }
    },
    {
      path: 'indicator',
      component: () => import('@/views/SecurityManage/indicator'),
      name: 'Indicator',
      meta: {
        title: 'indicator',
        icon: 'user'
      }
    }
  ]
}

export default router
