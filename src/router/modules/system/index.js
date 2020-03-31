import Layout from '@/layout'

import logRouter from './modules/log'
import fileRouter from './modules/file'
import qrCodeRouter from './modules/qrCode'
const systemRouter =
{
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: 'default.system.title',
    icon: 'component'
  },
  children: [
    {
      path: '/app',
      component: () => import('@/views/blank'),
      meta: { title: 'default.app.title', icon: 'component' },
      children: [logRouter, fileRouter]
    }, {
      path: '/utils',
      hidden: true,
      component: () => import('@/views/blank'),
      meta: { title: 'default.utils.title', icon: 'tree-table' },
      children: [qrCodeRouter]
    }
  ]
}

export default systemRouter
