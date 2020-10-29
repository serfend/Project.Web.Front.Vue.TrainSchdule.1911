
// import user_manager from './modules/user_manage'
import Social from './modules/user_manage/modules/Social'
import Company from './modules//user_manage/modules/Company'
import User from './modules//user_manage/modules/User'
import application from './modules/application'
const router = {
  path: '/settings',
  component: () => import('@/layout'),
  name: 'ApplicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [application, Social, Company, User]
}

export default router
