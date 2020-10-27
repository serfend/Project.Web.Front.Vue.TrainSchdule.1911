
import user_manager from './modules/user_manage'
import application from './modules/application'
const router = {
  path: '/settings',
  component: () => import('@/layout'),
  name: 'ApplicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [application, user_manager]
}

export default router
