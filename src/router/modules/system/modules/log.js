
const logRouter =
{
  path: '/app/log',
  component: () => import('@/views/common/LogView/index'),
  name: 'Log',
  meta: {
    title: 'default.app.log.title',
    icon: 'component'
  }
}

export default logRouter
