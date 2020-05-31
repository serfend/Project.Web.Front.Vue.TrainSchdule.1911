import Layout from '@/layout'
import UsersManager from './modules/UserManager/index'
import Application from './modules/Application/index'
const applicationSettingRouter = {
  path: '/setting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'applicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [Application, UsersManager]
}

export default applicationSettingRouter
