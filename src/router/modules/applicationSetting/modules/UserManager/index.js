import Social from './modules/Social'
import Company from './modules/Company'
const route = {
  path: 'userManager',
  component: () => import('@/views/blank'),
  name: 'UsersManage',
  meta: {
    title: 'application.setting.users.title',
    verify: 'on',
    icon: 'patriarch'
  },
  children: [Social, Company]
}
export default route
