
const dwzRouter =
{
  path: 'dwz',
  component: () => import('@/views/common/ShortUrl'),
  name: 'ShortUrlView',
  meta: {
    title: 'default.app.dwz.title',
    icon: 'link'
  }
}

export default dwzRouter
