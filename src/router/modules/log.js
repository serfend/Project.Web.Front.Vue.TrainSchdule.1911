
const logRouter =
{
  path: '/log',
  hidden: true,
  component: () => import('@/views/common/LogView/index'),
  name: 'Log',
  meta: {
    title: 'default.log.title',
    icon: 'component'
  }
}

export default logRouter
