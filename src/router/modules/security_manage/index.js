// import Layout from '@/layout'

const router = {
  path: '/security-manage/dashboard',
  component: () => import('@/views/SecurityManage/dashboard'),
  meta: {
    ctitle: '安全管理态势',
    icon: 'security-safe',
    hide_footer: true
  },
}

export default router
