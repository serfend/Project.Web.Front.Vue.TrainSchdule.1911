
// import user_manager from './modules/user_manage'
import Social from './modules/user_manage/Social'
import Company from './modules/user_manage/Company'
import User from './modules//user_manage/User'
import UserRestore from './modules/user_manage/UserRestore'
import application from './modules/application'
const router = {
  path: '/settings',
  component: () => import('@/layout'),
  name: 'ApplicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [application, Social, Company, User, UserRestore]
}

export default router
