const router = {
  path: '/usersManager/Social',
  component: () => import('@/views/usersManager/Social'),
  name: 'Social',
  meta: {
    title: 'application.setting.users.social',
    icon: 'addressbook'
  }
}

export default router
