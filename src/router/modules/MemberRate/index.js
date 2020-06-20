import Layout from '@/layout'

const router = {
  path: '/memberRate',
  hidden: true,
  component: Layout,
  children: [{
    path: 'summary',
    meta: {
      title: 'default.app.memberRate.summary.title',
      icon: 'component'
    },
    component: () => import('@/views/MemberRate')
  }, {
    path: 'config',
    meta: {
      title: 'default.app.memberRate.config.title',
      icon: 'component'
    },
    component: () => import('@/views/MemberRate/Config')
  }],
  name: 'MemberRate',
  meta: {
    title: 'default.app.memberRate.title',
    icon: 'component'
  }
}

export default router
