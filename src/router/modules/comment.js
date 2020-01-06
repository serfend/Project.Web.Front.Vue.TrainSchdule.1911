import Layout from '@/layout'
const commentsRouter =
{
  path: '/Comments',
  component: Layout,
  name: 'comments',
  meta: {
    title: 'comments.title',
    icon: 'wechat'
  }, children: [
    {
      path: '/Comments/Notice',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.notice.title',
        icon: 'notice'
      }
    }, {
      path: '/Comments/bbs',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.bbs.title',
        icon: 'bbs'
      }
    }]
}

export default commentsRouter
