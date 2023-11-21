import Export from './modules/Export'
const route = {
  path: 'application',
  component: () => import('@/views/blank'),
  name: 'Application',
  meta: {
    ctitle: '数据管理',
    icon: 'task_done'
  },
  children: [
    Export,
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/redirect'),
      name: 'ApplyDashboard',
      meta: {
        title: 'dashboard',
        icon: 'chart',
        hide_footer: true
      }
    },
    {
      path: 'statistics-vacation',
      component: () => import('@/views/statistics/vacation'),
      name: 'StatisticsVacation',
      meta: {
        ctitle: '休假统计',
        icon: 'chart'
      }
    }
  ]
}
export default route
