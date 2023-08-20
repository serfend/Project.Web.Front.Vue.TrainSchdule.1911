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
      path: 'configuration',
      component: () => import('@/layout'),
      meta: {
        ctitle: '安全管理配置',
        icon: 'security-configuration',
      },
      children: [
        {
          path: 'face-device',
          component: () => import('@/views/FaceDevice'),
          meta: {
            ctitle: '门禁设备管理',
            icon: 'face-detect',
          },
        },
        {
          path: 'weather',
          component: () => import('@/views/SecurityManage/Configuration/Weather'),
          meta: {
            ctitle: '天气配置',
            icon: 'weather',
          },
        },
        {
          path: 'event',
          component: () => import('@/views/SecurityManage/Configuration/Event'),
          meta: {
            ctitle: '事件配置',
            icon: 'sec-event',
          },
        },
        {
          path: 'statistics',
          component: () => import('@/views/SecurityManage/Configuration/MemberStatistics'),
          meta: {
            ctitle: '数据统计配置',
            icon: 'card-statistics',
          },
        },
        {
          path: 'indicator',
          component: () => import('@/views/SecurityManage/Configuration/Indicator'),
          meta: {
            ctitle: '指标配置',
            icon: 'indicator-radar',
          },
        },
        {
          path: 'global-config',
          component: () => import('@/views/SecurityManage/Configuration/GlobalConfig'),
          meta: {
            ctitle: '全局配置',
            icon: 'security-configuration',
          },
        },
      ]
    }
  ]
}

export default router
