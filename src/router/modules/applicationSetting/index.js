import Layout from '@/layout'
import UsersManager from './modules/UserManager/index'
import Application from './modules/Application/index'
import Version from './modules/Version'
const applicationSettingRouter = {
  path: '/setting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'applicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [Application, UsersManager, Version, {
    path: '/about/version',
    component: () => import('@/views/UpdateRecord/VersionDisplay'),
    hidden: true,
    name: 'versionDisplay',
    meta: {
      title: 'about.version.title',
      icon: 'fanhuima'
    }
  }]
}

export default applicationSettingRouter
