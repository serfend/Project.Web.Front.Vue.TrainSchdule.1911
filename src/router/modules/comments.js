
/* Layout */
import Layout from '@/layout'
export const CommentsRouter =
{
  path: '/Comments',
  component: Layout,
  name: 'comments',
  meta: {
    title: 'comments.title',
    icon: 'wechat'
  }, children: [
    {
      path: '/Comments/notice',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.notice.title',
        icon: 'notice'
      }
    }, {
      path: '/Comments/bbs',
      meta: {
        title: 'comments.bbs.title',
        icon: 'bbs'
      }
    }]
}

export default this
