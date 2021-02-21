const route = {
  path: 'user-restore',
  component: () => import('@/views/register/restore'),
  name: 'UsersRestore',
  meta: {
    ctitle: '账号恢复',
    icon: 'scan_namecard'
  },
}
export default route
