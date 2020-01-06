export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [
    {
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }
  ]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/register',
  component: Layout,
  children: [
    {
      path: '/register/main',
      component: () => import('@/views/register/index')
    }
  ],
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
},
{
  path: '',
  hidden: true,
  component: () => import('@/views/welcome/index')
},
{
  path: '/dashboard',
  component: Layout,
  // redirect: '/dashboard',
  children: [
    {
      path: '',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', affix: true }
    }
  ]
}]