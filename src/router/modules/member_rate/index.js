import Layout from '@/layout'

const router = {
  path: '/memberRate',
  component: Layout,
  children: [{
    path: 'summary',
    meta: {
      ctitle: '周考月评',
      icon: 'component'
    },
    component: () => import('@/views/MemberRate')
  }, {
    path: 'upload',
    meta: {
      ctitle: '上传评级',
      icon: 'component'
    },
    component: () => import('@/views/MemberRate/Upload')
  }, {
    path: 'config',
    meta: {
      ctitle: '设置',
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
