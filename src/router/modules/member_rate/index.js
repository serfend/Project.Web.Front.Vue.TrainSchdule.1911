import Layout from '@/layout'

const router = {
  path: '/memberRate',
  component: Layout,
  children: [{
    path: 'summary',
    meta: {
      ctitle: '周考月评',
      icon: 'exam'
    },
    component: () => import('@/views/MemberRate')
  }, {
    path: 'upload',
    meta: {
      ctitle: '管理评比',
      icon: 'component'
    },
    component: () => import('@/views/MemberRate/Upload')
  }, {
    path: 'summary-quarter',
    meta: {
      ctitle: '季度考评',
      icon: 'exam'
    },
    component: () => import('@/views/MemberRate/Upload')
  }, {
    path: 'summary-special',
    meta: {
      ctitle: '专项考评',
      icon: 'exam'
    },
    component: () => import('@/views/MemberRate/Upload')
  }, {
    path: 'summary-annual',
    meta: {
      ctitle: '年度考评',
      icon: 'exam'
    },
    component: () => import('@/views/MemberRate/Upload')
  },

  {
    path: 'config',
    meta: {
      ctitle: '设置',
      icon: 'component'
    },
    component: () => import('@/views/MemberRate/Config')
  }],
  name: 'MemberRate',
  meta: {
    ctitle: '考核纪实',
    icon: 'component'
  }
}

export default router
