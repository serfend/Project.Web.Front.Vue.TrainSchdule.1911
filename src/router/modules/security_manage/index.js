// import Layout from '@/layout'

const router = {
  path: '/security-manage',
  component: () => import('@/views/blank'),
  meta: {
    ctitle: '安全管理',
    icon: 'security-safe'
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/SecurityManage/dashboard'),
      meta: {
        ctitle: '安全管理态势',
        icon: 'security-safe',
        hide_footer: true
      }
    },
    {
      path: 'test',
      component: () => import('@/views/SecurityManage'),
      meta: {
        ctitle: '安全管理测试',
        icon: 'security-safe',
        hide_footer: true
      }
    }
  ]
}

export default router
