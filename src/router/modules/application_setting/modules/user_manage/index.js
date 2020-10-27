import Social from './modules/Social'
import Company from './modules/Company'
const route = {
  path: 'user-manager',
  component: () => import('@/views/blank'),
  name: 'UsersManage',
  meta: {
    title: 'application.setting.users.title',
    icon: 'patriarch'
  },
  children: [Social, Company]
}
export default route
