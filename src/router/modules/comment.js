import Layout from '@/layout'
const commentsRouter =
{
  path: '/Comments',
  component: Layout,
  name: 'comments',
  meta: {
    title: 'comments.title',
    icon: 'community_line'
  }, children: [
    {
      path: '/Comments/Notice',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.notice.title',
        icon: 'dispose'
      }
    }, {
      path: '/Comments/bbs',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.bbs.title',
        icon: 'group'
      }
    }]
}

export default commentsRouter
