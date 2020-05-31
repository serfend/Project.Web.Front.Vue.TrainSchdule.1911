
const logRouter =
{
  path: 'log',
  component: () => import('@/views/common/LogView/index'),
  name: 'Log',
  meta: {
    title: 'default.app.log.title',
    icon: 'journal_fill'
  }
}

export default logRouter
