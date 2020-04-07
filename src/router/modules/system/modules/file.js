
const fileRouter =
{
  path: '/app/fileEngine',
  component: () => import('@/views/common/FileEngine/index'),
  name: 'FileEngine',
  meta: {
    title: 'default.app.file.title',
    icon: 'component'
  }
}

export default fileRouter