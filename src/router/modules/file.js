
const fileRouter =
{
  path: '/fileEngine',
  hidden: true,
  component: () => import('@/views/common/FileEngine/index'),
  name: 'FileEngine',
  meta: {
    title: 'default.file.title',
    icon: 'component'
  }
}

export default fileRouter
